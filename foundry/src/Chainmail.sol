//SPDX Licence Identifier: MIT

pragma solidity ^0.8.18;

import {Verifier} from "./Verifier.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Chainmail
 * @author HumptyDumptyDevs and Fedor!
 * @notice A marketplace for buying and selling encrypted emails
 */
contract Chainmail is ERC20, Ownable {
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
    error Chainmail__InvalidDisputeInitiator();
    error Chainmail__FulfilmentBufferNotPassed();
    error Chainmail__DisputeTimeHasPassed();

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
        uint256 fulfilledAt;
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
        string reason;
    }

    struct Vote {
        bool buyerIsRight;
        uint256 amount;
        bool claimed;
    }
    // disputeId => address => bool

    mapping(address => mapping(uint256 => bool)) private s_alreadyVoted;

    // address => disputeId => Vote
    mapping(address => mapping(uint256 => Vote)) private s_Votes;

    ////////////////////////
    //  State Variables   //
    ////////////////////////

    //Immutables
    Verifier private i_verifier;
    uint256 public i_stakeOfAuthenticity;

    // Constants
    uint256 public constant DISPUTE_DURATION = 2 days;
    uint256 public constant FULFILMENT_BUFFER = 1 days;

    //Storage
    uint256 public s_listingId;
    mapping(uint256 listingId => Listing listing) private s_listings; // Mapping of listingId to the Listing
    mapping(address buyer => uint256[] listingIds) private s_buyersListings; // Mapping of buyer to listing ids (buyer can have multiple listings)
    mapping(address owner => uint256[] listingIds) private s_ownersListings; // Mapping of owner to listing ids (owner can have multiple listings)

    uint256[] private s_activeListingIds; // Array of active listing ids so we can loop through them

    // Disputes
    mapping(uint256 listingId => Dispute dispute) public s_disputes;

    ///////////////
    // Events   //
    //////////////
    event ListingCreated(uint256 indexed listingId, address indexed owner, string indexed description, uint256 price);
    event ListingStatusChanged(uint256 indexed listingId, ListingStatus indexed status);
    event ListingPurchased(uint256 indexed listingId, address indexed buyer, uint256 price);
    event ListingDelivered(
        uint256 indexed listingId, address indexed owner, address indexed buyer, bytes encryptedMailData
    );
    event ListingPriceClaimed(uint256 indexed listingId, address indexed owner, address indexed buyer);
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

    constructor(address _verifier, uint256 _stakeOfAuthenticity)
        ERC20("Chainmail Voting Power", "Chainmail Voting Power")
        Ownable(msg.sender)
    {
        _mint(msg.sender, 2013_05_20 * 10 ** 18);
        i_verifier = Verifier(_verifier);
        i_stakeOfAuthenticity = _stakeOfAuthenticity;
        s_listingId = 0;
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
            fulfilledAt: 0,
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
        listing.fulfilledAt = block.timestamp;

        emit ListingDelivered(_listingId, listing.owner, msg.sender, _encryptedMailData);
        emit ListingStatusChanged(_listingId, ListingStatus.FULFILLED);
    }

    /*
     * @notice Once the buffer for dispute raising has passed, allow the owner to claim the price
     * @param _listingId The id of the listing to claim
     */
    function claimPrice(uint256 _listingId) public {
        Listing storage listing = s_listings[_listingId];

        if (listing.status != ListingStatus.FULFILLED) {
            revert Chainmail__InvalidListingStatus(listing.status);
        }

        if (block.timestamp < listing.fulfilledAt + FULFILMENT_BUFFER) {
            revert Chainmail__FulfilmentBufferNotPassed();
        }

        listing.status = ListingStatus.COMPLETED;
        emit ListingStatusChanged(_listingId, ListingStatus.COMPLETED);
        emit ListingPriceClaimed(_listingId, listing.owner, listing.buyer);

        // Make Transfers

        uint256 amountToTransferToOwner = listing.price + listing.ownerStakeOfAuthenticity;
        uint256 amountToTransferToBuyer = listing.buyerStakeOfAuthenticity;

        transfer(listing.owner, amountToTransferToOwner);
        transfer(listing.buyer, amountToTransferToBuyer);
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

    function getListingPrice(uint256 _listingId) external view returns (uint256) {
        return s_listings[_listingId].price;
    }

    function getListingStatus(uint256 _listingId) external view returns (ListingStatus) {
        return s_listings[_listingId].status;
    }

    function getVoteStatusOfListing(uint256 _listingId, address _voter) external view returns (bool) {
        return s_alreadyVoted[_voter][_listingId];
    }

    ///////////////
    // Dispute   //
    //////////////

    /*
    * Allows the buyer or owner to dispute the listing
    * @param _listingId The id of the listing
    * @param _buyersSecretPgpKey The buyers secret pgp key
    * @param reason The reason for the dispute
    */
    function dispute(uint256 _listingId, bytes memory _buyersSecretPgpKey, string memory reason) public {
        if (s_listings[_listingId].status != ListingStatus.FULFILLED) {
            revert Chainmail__InvalidListingStatus(s_listings[_listingId].status);
        }

        if (block.timestamp > s_listings[_listingId].fulfilledAt + FULFILMENT_BUFFER) {
            revert Chainmail__DisputeTimeHasPassed();
        }

        if (msg.sender != s_listings[_listingId].buyer) {
            revert Chainmail__InvalidDisputeInitiator();
        }

        Dispute memory _dispute = Dispute({
            listingId: _listingId,
            createdAt: block.timestamp,
            buyersSecretPgpKey: _buyersSecretPgpKey,
            votesForOwner: 0,
            votesForBuyer: 0,
            reason: reason
        });

        s_disputes[_listingId] = _dispute;
        s_listings[_listingId].status = ListingStatus.DISPUTED;

        emit ListingStatusChanged(_listingId, ListingStatus.DISPUTED);
        emit ListingDisputed(_listingId, s_listings[_listingId].buyer, s_listings[_listingId].owner);
    }

    /**
     * Allows the buyer or owner to vote on the dispute
     * @param buyerIsRight True if the buyer is right, false if the owner is right
     * @param _listingId The id of the listing
     */
    function vote(bool buyerIsRight, uint256 _listingId) public {
        if (s_listings[_listingId].status != ListingStatus.DISPUTED) {
            revert Chainmail__InvalidListingStatus(s_listings[_listingId].status);
        }

        // Dispute duration has passed
        if (block.timestamp > s_disputes[_listingId].createdAt + DISPUTE_DURATION) {
            revert Chainmail__DisputeDurationPassed();
        }

        if (s_alreadyVoted[msg.sender][_listingId]) {
            revert Chainmail__AlreadyVoted();
        }

        if (buyerIsRight) {
            s_disputes[_listingId].votesForBuyer += balanceOf(msg.sender);
        } else {
            s_disputes[_listingId].votesForOwner += balanceOf(msg.sender);
        }

        s_alreadyVoted[msg.sender][_listingId] = true;
        s_Votes[msg.sender][_listingId] =
            Vote({buyerIsRight: buyerIsRight, amount: balanceOf(msg.sender), claimed: false});

        uint256 totalVotes = s_disputes[_listingId].votesForOwner + s_disputes[_listingId].votesForBuyer;
        uint256 quoram = totalSupply() / 2;

        if (totalVotes >= quoram) {
            resolve(_listingId);
        }

        emit ListingDisputeUpdated(
            _listingId, s_disputes[_listingId].votesForOwner, s_disputes[_listingId].votesForBuyer
        );
    }

    /**
     * Called after the dispute duration has passed to resolve the dispute
     */
    function resolve(uint256 _listingId) public {
        if (s_listings[_listingId].status != ListingStatus.DISPUTED) {
            revert Chainmail__InvalidListingStatus(s_listings[_listingId].status);
        }

        bool quoramReached = false;
        uint256 totalVotes = s_disputes[_listingId].votesForOwner + s_disputes[_listingId].votesForBuyer;
        uint256 quoram = totalSupply() / 2;

        if (totalVotes >= quoram) {
            quoramReached = true;
        }

        if (quoramReached == false && block.timestamp < s_disputes[_listingId].createdAt + DISPUTE_DURATION) {
            revert Chainmail__DisputeDurationPassed();
        }

        s_listings[_listingId].status = ListingStatus.COMPLETED;
        emit ListingStatusChanged(_listingId, ListingStatus.COMPLETED);

        //Transfer winners stake of authenticity back to them
        if (s_disputes[_listingId].votesForBuyer > s_disputes[_listingId].votesForOwner) {
            // Buyer wins
            address buyer = s_listings[_listingId].buyer;
            uint256 amountToTransfer = s_listings[_listingId].buyerStakeOfAuthenticity + s_listings[_listingId].price;

            transfer(buyer, amountToTransfer);
            //transfer their price back to them
        } else {
            // Owner wins
            address owner = s_listings[_listingId].owner;
            uint256 amountToTransfer = s_listings[_listingId].ownerStakeOfAuthenticity + s_listings[_listingId].price;
            transfer(owner, amountToTransfer);
        }
    }

    /*
    * Allows anyone to claim the reward
    * @param _listingId The id of the listing
    */
    function claim(uint256 _listingId) public {
        if (s_listings[_listingId].status != ListingStatus.COMPLETED) {
            revert Chainmail__InvalidListingStatus(s_listings[_listingId].status);
        }

        if (!s_Votes[msg.sender][_listingId].claimed) {
            if (s_disputes[_listingId].votesForBuyer > s_disputes[_listingId].votesForOwner) {
                // Buyer wins
                if (s_Votes[msg.sender][_listingId].buyerIsRight) {
                    uint256 amount = (s_Votes[msg.sender][_listingId].amount / s_disputes[_listingId].votesForBuyer)
                        * s_listings[_listingId].buyerStakeOfAuthenticity;

                    s_Votes[msg.sender][_listingId].claimed = true;
                    transfer(msg.sender, amount);
                }
            } else {
                // Owner wins
                if (!s_Votes[msg.sender][_listingId].buyerIsRight) {
                    // Buyer has voted for the owner

                    uint256 amount = (s_Votes[msg.sender][_listingId].amount / s_disputes[_listingId].votesForOwner)
                        * s_listings[_listingId].ownerStakeOfAuthenticity;

                    s_Votes[msg.sender][_listingId].claimed = true;
                    transfer(msg.sender, amount);
                }
            }
        }
    }

    function getDispute(uint256 _listingId) public view returns (Dispute memory) {
        return s_disputes[_listingId];
    }
}
