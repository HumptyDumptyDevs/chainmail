//SPDX Licence Identifier: MIT

pragma solidity ^0.8.18;

import {Verifier} from "./Verifier.sol";

/**
 * @title Chainmail
 * @author HumptyDumptyDevs
 * @notice A marketplace for buying and selling encrypted emails
 */
contract Chainmail {
    //////////////
    // Structs //
    ////////////

    struct Proof {
        uint256[3] pi_a;
        uint256[2][3] pi_b;
        uint256[3] pi_c;
        string protocol;
        string curve;
        uint256[5] pubSignals;
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

    ////////////////////////
    //  State Variables   //
    ////////////////////////

    //Immutables

    Verifier private i_verifier;
    uint256 private i_stakeOfAuthenticity;

    //Storage

    uint256 private s_listingId;

    /////////////////
    // Constructor //
    ////////////////

    constructor(address _verifier, int256 _stakeOfAuthenticity) {
        i_verifier = Verifier(_verifier);
        i_stakeOfAuthenticity = _stakeOfAuthenticity;
        s_listingId = 0;
    }
}
