//SPDX Licence Identifier: MIT

pragma solidity ^0.8.18;

import {Verifier} from "./Verifier.sol";
import {ChainmailDao} from "./ChainmailDao.sol";

/**
 * @title Chainmail
 * @author HumptyDumptyDevs and Fedor!
 * @notice A marketplace for buying and selling encrypted emails
 */
contract Chainmail {
    ///////////////
    //  Errors   //
    //////////////

    error Chainmail__MustBeMoreThanZero();
    error Chainmail__InvalidProof();
    error Chainmail__InsufficientStakeOfAuthenticity(uint256 _msgValue, uint256 _stakeOfAuthenticity);
    error Chainmail__InvalidListingStatus(ListingStatus _status);
    error Chainmail__InvalidListingId();
    error Chainmail__InsufficientEthSent(uint256 _msgValue, uint256 _totalEthRequired);
    error Chainmail__InvalidListingOwner();
    error Chainmail__OwnerTransferFailed();
    error Chainmail__BuyerTransferFailed();

    error Chainmail__AlreadyVoted();
    error Chainmail__DisputeDurationPassed();

    //////////////
    //  Types  //
    /////////////

    enum ListingStatus {
        ACTIVE,
        PENDING_DELIVERY,
        FULFILLED,
        COMPLETED,
        DISPUTED
    }

    //////////////
    // Structs //
    ////////////

    struct Proof {
        uint256[3] pi_a;
        uint256[2][3] pi_b;
        uint256[3] pi_c;
        string protocol;
        string curve;
        uint256[6] pubSignals;
    }

    struct Listing {
        uint256 id;
        ListingStatus status;
        address owner;
        string description;
        uint256 price;
        uint256 ownerStakeOfAuthenticity; // Do I need to track these in the lising?
        uint256 buyerStakeOfAuthenticity; // I dont think I do.
        uint256 createdAt;
        Proof proof;
        bytes buyersPublicPgpKey;
        bytes encryptedMailData;
        address buyer;
    }

    struct Dispute {
        uint256 listingId;
        uint256 createdAt;
        bytes buyersSecretPgpKey;
        uint256 votesForOwner;
        uint256 votesForBuyer;
    }

    mapping(uint256 => mapping(address => bool)) private s_alreadyVoted;

    ////////////////////////
    //  State Variables   //
    ////////////////////////

    //Immutables
    Verifier private i_verifier;
    uint256 private i_stakeOfAuthenticity;

    // Constants
    uint256 constant DISPUTE_DURATION = 2 days;

    //Storage

    uint256 private s_listingId;
    mapping(uint256 listingId => Listing listing) private s_listings; // Mapping of listingId to the Listing
    mapping(address buyer => uint256[] listingIds) private s_buyersListings; // Mapping of buyer to listing ids (buyer can have multiple listings)
    mapping(address owner => uint256[] listingIds) private s_ownersListings; // Mapping of owner to listing ids (owner can have multiple listings)

    uint256[] private s_activeListingIds; // Array of active listing ids so we can loop through them

    // Disputes
    mapping(uint256 listingId => Dispute dispute) private s_disputes;

    // DAO
    ChainmailDao private i_chainmailDao;

    ///////////////
    // Events   //
    //////////////
    event ListingCreated(uint256 indexed listingId, address indexed owner, string indexed description, uint256 price);
    event ListingStatusChanged(uint256 indexed listingId, ListingStatus indexed status);
    event ListingPurchased(uint256 indexed listingId, address indexed buyer, uint256 price);
    event ListingDelivered(
        uint256 indexed listingId, address indexed owner, address indexed buyer, bytes encryptedMailData
    );
    event ListingDisputed(uint256 indexed listingId, address indexed buyer, address indexed owner);
    event ListingDisputeUpdated(uint256 indexed listingId, uint256 votesForOwner, uint256 votesForBuyer);

    ///////////////
    // Modifiers //
    //////////////
    modifier moreThanZero(uint256 _amount) {
        if (_amount <= 0) {
            revert Chainmail__MustBeMoreThanZero();
        }
        _;
    }

    modifier isCorrectStatus(uint256 _listingId, ListingStatus _status) {
        ListingStatus status = s_listings[_listingId].status;
        if (status != _status) {
            revert Chainmail__InvalidListingStatus(status);
        }
        _;
    }

    /////////////////
    // Constructor //
    ////////////////

    constructor(address _verifier, uint256 _stakeOfAuthenticity, address _chainmailDao) {
        i_verifier = Verifier(_verifier);
        i_stakeOfAuthenticity = _stakeOfAuthenticity;
        s_listingId = 0;
        i_chainmailDao = ChainmailDao(_chainmailDao);
    }

    //////////////////
    //  Functions  //
    ////////////////

    /////////////////////////
    // External Functions //
    ////////////////////////

    /*
     *  @notice Create a new listing
     *  @param proof The proof of the zk-SNARK
     *  @param pubSignals The public signals of the zk-SNARK
     *  @param description The description of the listing
     *  @param price The price of the listing
     */
    function createListing(Proof memory _proof, string memory _description, uint256 _price)
        public
        payable
        moreThanZero(msg.value)
    {
        uint256[6] memory pubSignals = _proof.pubSignals;
        uint256[2] memory proof_a = [_proof.pi_a[0], _proof.pi_a[1]];
        uint256[2][2] memory proof_b = [[_proof.pi_b[0][1], _proof.pi_b[0][0]], [_proof.pi_b[1][1], _proof.pi_b[1][0]]];
        uint256[2] memory proof_c = [_proof.pi_c[0], _proof.pi_c[1]];

        bool isValid = i_verifier.verifyProof(proof_a, proof_b, proof_c, pubSignals);

        if (!isValid) {
            revert Chainmail__InvalidProof();
        }

        if (msg.value < i_stakeOfAuthenticity) {
            revert Chainmail__InsufficientStakeOfAuthenticity(msg.value, i_stakeOfAuthenticity);
        }

        s_listings[s_listingId] = Listing({
            id: s_listingId,
            status: ListingStatus.ACTIVE,
            owner: msg.sender,
            description: _description,
            price: _price,
            ownerStakeOfAuthenticity: msg.value,
            buyerStakeOfAuthenticity: 0,
            createdAt: block.timestamp,
            proof: _proof,
            buyersPublicPgpKey: "",
            encryptedMailData: "",
            buyer: address(0)
        });

        s_ownersListings[msg.sender].push(s_listingId); // Add the listing to the owners listings
        s_activeListingIds.push(s_listingId); // Add the listing to the active listings
        s_listingId++;

        emit ListingCreated(s_listingId, msg.sender, _description, _price);
        emit ListingStatusChanged(s_listingId, ListingStatus.ACTIVE);
    }

    /*
     *  @notice Allows a buyer to purchase the listing
     *  @param listingId The id of the listing
     *  @dev The buyer must send the exact amount of eth to purchase the listing
     *  Checks / Effects / Interactions:
     */
    function purchaseListing(uint256 _listingId, bytes memory _buyersPublicPgpKey)
        public
        payable
        moreThanZero(msg.value)
        isCorrectStatus(_listingId, ListingStatus.ACTIVE)
    {
        Listing storage listing = s_listings[_listingId];

        if (listing.owner == address(0)) {
            revert Chainmail__InvalidListingId();
        }

        uint256 totalEthRequired = listing.price + i_stakeOfAuthenticity;

        if (msg.value < totalEthRequired) {
            revert Chainmail__InsufficientEthSent(msg.value, totalEthRequired);
        }

        // Add the listing to the buyers listings
        s_buyersListings[msg.sender].push(_listingId);

        listing.status = ListingStatus.PENDING_DELIVERY;
        listing.buyersPublicPgpKey = _buyersPublicPgpKey;
        listing.buyer = msg.sender;
        listing.buyerStakeOfAuthenticity = i_stakeOfAuthenticity;

        emit ListingPurchased(_listingId, msg.sender, listing.price);
        emit ListingStatusChanged(_listingId, ListingStatus.PENDING_DELIVERY);
    }

    /*
     * @notice Allows the owner to fulfil the listing when pending delivery
     * @param _listingId The id of the listing to fulfil
     * @param encryptedMailData The encrypted mail data provided by the seller, encrypted with the buyers public key
     * @notice Although we can't prove that the encryptedMailData is a valid pgp encrypted message signed with the buyers public key
     * by asking the seller to also provide a hash of the buyers public key, they are making a commitment to the public key they used
     * adding weight to the assumption that any form of deception would be intentional
     */
    function fulfilListing(uint256 _listingId, bytes memory _encryptedMailData)
        public
        isCorrectStatus(_listingId, ListingStatus.PENDING_DELIVERY)
    {
        //Can we verify that encryptedMailData is a valid pgp encrypted message signed with the buyers public key?
        Listing storage listing = s_listings[_listingId];

        if (listing.status != ListingStatus.PENDING_DELIVERY) {
            revert Chainmail__InvalidListingStatus(listing.status);
        }

        if (msg.sender != listing.owner) {
            revert Chainmail__InvalidListingOwner();
        }

        listing.encryptedMailData = _encryptedMailData;
        listing.status = ListingStatus.FULFILLED;

        emit ListingDelivered(_listingId, listing.owner, msg.sender, _encryptedMailData);
        emit ListingStatusChanged(_listingId, ListingStatus.FULFILLED);

        uint256 totalEthToSendToOwner = listing.price + listing.ownerStakeOfAuthenticity;

        (bool ownerTransferSuccess,) = listing.owner.call{value: totalEthToSendToOwner}("");

        if (!ownerTransferSuccess) {
            revert Chainmail__OwnerTransferFailed(); // I am not sure if this is the right way to handle this
        }

        //Also refund the stake of authenticity to the buyer
        (bool buyerTransferSuccess,) = listing.buyer.call{value: listing.buyerStakeOfAuthenticity}("");

        if (!buyerTransferSuccess) {
            revert Chainmail__BuyerTransferFailed(); // I am not sure if this is the right way to handle this
        }
    }

    //////////////////////////////////////
    // Public & External View Functions //
    /////////////////////////////////////

    /*
     *  @notice Get all active listings
     *  This function returns an array of active listings by using the activeListingIds array
     *
     */
    function getActiveListings() external view returns (Listing[] memory) {
        uint256 activeCount = s_activeListingIds.length;
        Listing[] memory activeListings = new Listing[](activeCount);

        for (uint256 i = 0; i < activeCount; i++) {
            uint256 listingId = s_activeListingIds[i];
            activeListings[i] = s_listings[listingId];
        }

        return activeListings;
    }

    /*
     * @notice Get all the listings where the address is the seller
     * This function returns an array of listings where the msg.sender is the seller
     *
     */
    function getOwnersListings(address _owner) external view returns (Listing[] memory) {
        uint256 ownerCount = s_ownersListings[_owner].length;
        Listing[] memory ownersListings = new Listing[](ownerCount);

        for (uint256 i = 0; i < ownerCount; i++) {
            uint256 listingId = s_ownersListings[_owner][i];
            ownersListings[i] = s_listings[listingId];
        }

        return ownersListings;
    }

    /*
     * @notice Get all the listings where the address is the buyer
     * This function returns an array of listings where the is the buyer
     *
     */
    function getBuyersListings(address _buyer) external view returns (Listing[] memory) {
        uint256 buyerCount = s_buyersListings[_buyer].length;
        Listing[] memory buyersListings = new Listing[](buyerCount);

        for (uint256 i = 0; i < buyerCount; i++) {
            uint256 listingId = s_buyersListings[_buyer][i];
            buyersListings[i] = s_listings[listingId];
        }

        return buyersListings;
    }

    function getStakeOfAuthenticity() external view returns (uint256) {
        return i_stakeOfAuthenticity;
    }

    ///////////////
    // Dispute   //
    //////////////

    function dispute(uint256 _listingId, bytes memory _buyersSecretPgpKey) public {
        if (s_listings[_listingId].status != ListingStatus.FULFILLED) {
            revert Chainmail__InvalidListingStatus(s_listings[_listingId].status);
        }

        if (msg.sender != s_listings[_listingId].buyer || msg.sender != s_listings[_listingId].owner) {
            revert Chainmail__InvalidListingOwner();
        }

        Dispute memory _dispute = Dispute({
            listingId: _listingId,
            createdAt: block.timestamp,
            buyersSecretPgpKey: _buyersSecretPgpKey,
            votesForOwner: 0,
            votesForBuyer: 0
        });

        s_disputes[_listingId] = _dispute;
        s_listings[_listingId].status = ListingStatus.DISPUTED;

        emit ListingStatusChanged(_listingId, ListingStatus.DISPUTED);
        emit ListingDisputed(_listingId, s_listings[_listingId].buyer, s_listings[_listingId].owner);
    }

    function vote(bool buyerIsRight, uint256 _listingId) public {
        if (s_listings[_listingId].status != ListingStatus.DISPUTED) {
            revert Chainmail__InvalidListingStatus(s_listings[_listingId].status);
        }

        // Dispute duration has passed
        if (block.timestamp > s_disputes[_listingId].createdAt + DISPUTE_DURATION) {
            revert Chainmail__DisputeDurationPassed();
        }

        if (s_alreadyVoted[_listingId][msg.sender]) {
            revert Chainmail__AlreadyVoted();
        }

        if (buyerIsRight) {
            s_disputes[_listingId].votesForBuyer += i_chainmailDao.balanceOf(msg.sender);
        } else {
            s_disputes[_listingId].votesForOwner += i_chainmailDao.balanceOf(msg.sender);
        }
        s_alreadyVoted[_listingId][msg.sender] = true;

        emit ListingDisputeUpdated(
            _listingId, s_disputes[_listingId].votesForOwner, s_disputes[_listingId].votesForBuyer
        );
    }

    function resolve(uint256 _listingId) public {
        if (s_listings[_listingId].status != ListingStatus.DISPUTED) {
            revert Chainmail__InvalidListingStatus(s_listings[_listingId].status);
        }

        address payable buyer = payable(s_listings[_listingId].buyer);
        address payable owner = payable(s_listings[_listingId].owner);
        address payable dao = payable(address(i_chainmailDao));

        if (s_disputes[_listingId].votesForBuyer > s_disputes[_listingId].votesForOwner) {
            buyer.transfer(s_listings[_listingId].price);
            buyer.transfer(s_listings[_listingId].buyerStakeOfAuthenticity);
            dao.transfer(s_listings[_listingId].ownerStakeOfAuthenticity);
        } else {
            owner.transfer(s_listings[_listingId].price);
            owner.transfer(s_listings[_listingId].ownerStakeOfAuthenticity);
            dao.transfer(s_listings[_listingId].buyerStakeOfAuthenticity);
        }

        s_listings[_listingId].status = ListingStatus.COMPLETED;
        emit ListingStatusChanged(_listingId, ListingStatus.COMPLETED);
    }

    function getDispute(uint256 _listingId) public view returns (Dispute memory) {
        return s_disputes[_listingId];
    }
}
