//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {DeployChainmail} from "../../script/DeployChainmail.s.sol";
import {Chainmail} from "../../src/Chainmail.sol";
import {Verifier} from "../../src/Verifier.sol";
import {Constants} from "../../script/Constants.s.sol";

contract ChainmailTest is Test {
    Chainmail public chainmail;
    Verifier public verifier;
    Constants public constants;

    Chainmail.Proof public proof;

    address ALICE = vm.addr(vm.envUint("PRIVATE_KEY"));
    address BOB = makeAddr("BOB");
    address CHARLIE = makeAddr("CHARLIE");

    uint256 public stakeOfAuthenticity;
    uint256 public listingTimeLimit;
    uint256 public expirationReward;
    uint256 public expirationRewardDivisor;

    uint256 constant STARTING_BALANCE = 100 ether;

    bytes public bobPublicKeyBytes = abi.encodePacked(
        "-----BEGIN PGP PUBLIC KEY BLOCK-----\n\n",
        "xjMEZlLGwhYJKwYBBAHaRw8BAQdAlGHIxxVirNCehzKaCewDhkj+5eZPmr0v\n",
        "d4hXgwS5G0zNKjB4NjQ4RTdCNDJlNzVDYTcxRWEwNmQ0NUYxZTVjYUQ5MkMw\n",
        "NDg2RjNiOcKMBBAWCgA+BYJmUsbCBAsJBwgJkEGHOL+tg7sPAxUICgQWAAIB\n",
        "AhkBApsDAh4BFiEEwsGurSTA7IQxnmxWQYc4v62Duw8AAI8wAP4wkukxQKLK\n",
        "Cpq93oyTc012CcwLJMxMCziN/aXnI37XaQEAoK8VUtgSCHytvGhJSSMMRqmG\n",
        "N2hjsi5m8qlY9lsNRwTOOARmUsbCEgorBgEEAZdVAQUBAQdAhQVVT++ux3eN\n",
        "C383D1WfVnR0GEyvfVFQIxjFV7SRIBoDAQgHwngEGBYKACoFgmZSxsIJkEGH\n",
        "OL+tg7sPApsMFiEEwsGurSTA7IQxnmxWQYc4v62Duw8AAHhIAP0XQ5ICJyk2\n",
        "4/b0IEvbMTQ4BTYIzuvjnIBD8p3q946LRAEA7vdgZQx5+iRY6AH2384e7rVf\n",
        "1XRYAtUOiM//poCa5wM=\n",
        "=K+Vd\n",
        "-----END PGP PUBLIC KEY BLOCK-----"
    );

    bytes public bobPrivateKeyBytes = abi.encodePacked(
        "-----BEGIN PGP PRIVATE KEY BLOCK-----\n\n",
        "xVgEZlLGwhYJKwYBBAHaRw8BAQdAlGHIxxVirNCehzKaCewDhkj+5eZPmr0v\n",
        "d4hXgwS5G0wAAPwK3TelvGtDrEaYIB39iZB1sk7EVpKpi90jNJhwWlSN7BC+\n",
        "zSoweDY0OEU3QjQyZTc1Q2E3MUVhMDZkNDVGMWU1Y2FEOTJDMDQ4NkYzYjnC\n",
        "jAQQFgoAPgWCZlLGwgQLCQcICZBBhzi/rYO7DwMVCAoEFgACAQIZAQKbAwIe\n",
        "ARYhBMLBrq0kwOyEMZ5sVkGHOL+tg7sPAACPMAD+MJLpMUCiygqavd6Mk3NN\n",
        "dgnMCyTMTAs4jf2l5yN+12kBAKCvFVLYEgh8rbxoSUkjDEaphjdoY7IuZvKp\n",
        "WPZbDUcEx10EZlLGwhIKKwYBBAGXVQEFAQEHQIUFVU/vrsd3jQt/Nw9Vn1Z0\n",
        "dBhMr31RUCMYxVe0kSAaAwEIBwAA/0aAJ06N3+o5V7hlFH8BRaPCXm6C1T/r\n",
        "nMXQu1YjWP3oEWrCeAQYFgoAKgWCZlLGwgmQQYc4v62Duw8CmwwWIQTCwa6t\n",
        "JMDshDGebFZBhzi/rYO7DwAAeEgA/RdDkgInKTbj9vQgS9sxNDgFNgjO6+Oc\n",
        "gEPyner3jotEAQDu92BlDHn6JFjoAfbfzh7utV/VdFgC1Q6Iz/+mgJrnAw==\n",
        "=4o2a\n",
        "-----END PGP PRIVATE KEY BLOCK-----"
    );

    bytes aliceEncryptedMessage = abi.encodePacked(
        "-----BEGIN PGP MESSAGE-----\n",
        "wV4D4E9i8Wmuaj0SAQdAMm5AGCKSq8NK8YJ6BFjjPF/aQkNApw2YCiFTYNrV\n",
        "HzEwWnVlokwln9aqRjhXsxYh9E093cLNVgrRTS2SIKiH+87DjG6nsYAEGXkK\n",
        "675tVaO60sBSAShLPRRtS7Sp09ZWo1ba8Bl6dtisucBu1KVG+rve7LxPvEsv\n",
        "x2V1h2QlT3OcomIFnh+Y2PJontp94l6oyZVlB3N+dMmx7QyJey2ivPYxHUxv\n",
        "LzdBCEeipa3c10r2ve0J94mqjKoUsR/UeNx9qZX2ty/z/qXh+q1AgJGVa/j0\n",
        "odfeUpJOmchfsN2W9/r7O+sicACSjb6nScC09iF33at6KoXOaM++MYP2uSVc\n",
        "bjnXr+Qw0Q+8KJWjGYNiApMrBGCZv/onB3fF6EGhtXlDT8q+B86rbe7PYZaR\n",
        "ZB/Q5oGBDIDe1JquQMOZlL2yEhOTIYKOc3gMd7b2k77Xw3cjFoCWpDZ7hcWs\n",
        "FdYK8yg+ZMaBrwO0Pg==\n",
        "=nXxL\n",
        "-----END PGP MESSAGE-----\n"
    );

    function setUp() external {
        DeployChainmail deploy = new DeployChainmail();
        (chainmail, verifier) = deploy.run();
        constants = new Constants();
        proof = constants.getProof();

        stakeOfAuthenticity = chainmail.getStakeOfAuthenticity();

        vm.deal(ALICE, STARTING_BALANCE);
        vm.deal(BOB, STARTING_BALANCE);
        vm.deal(CHARLIE, STARTING_BALANCE);
    }

    //Helper functions
    function getTotalPrice(uint256 _listingId) public view returns (uint256) {
        uint256 price = chainmail.getListingPrice(_listingId);
        return price + stakeOfAuthenticity;
    }

    modifier aliceCreatesListing() {
        string memory description = "This contains an email that says hello";

        uint256 price = 1 ether;

        vm.prank(ALICE);
        chainmail.createListing{value: stakeOfAuthenticity}(proof, description, price);

        _;
    }

    modifier bobPurchaseListing() {
        uint256 payment = getTotalPrice(0);
        vm.prank(BOB);
        chainmail.purchaseListing{value: payment}(0, bobPublicKeyBytes);

        _;
    }

    modifier bobOpensDisputeAgainstAlice() {
        string memory description = "This contains an email that says hello";

        uint256 price = 1 ether;

        vm.prank(ALICE);
        chainmail.createListing{value: stakeOfAuthenticity}(proof, description, price);

        uint256 payment = getTotalPrice(0);
        vm.prank(BOB);
        chainmail.purchaseListing{value: payment}(0, bobPublicKeyBytes);

        // Alice fulils the listing
        vm.prank(ALICE);
        chainmail.fulfilListing(0, aliceEncryptedMessage);

        // Bob opens a dispute
        vm.prank(BOB);
        chainmail.dispute(0, bobPrivateKeyBytes, "The emails isnt good");

        _;
    }

    function testIsDisputeOpened() external bobOpensDisputeAgainstAlice {
        Chainmail.ListingStatus status = chainmail.getListingStatus(0);
        console.log("status: ", uint256(status));
        assertTrue(status == Chainmail.ListingStatus.DISPUTED);
    }

    function testDisputeResolvesIfQuoramIsReached() external bobOpensDisputeAgainstAlice {
        vm.startPrank(msg.sender);
        uint256 totalSupply = chainmail.totalSupply();
        chainmail.transfer(CHARLIE, totalSupply);
        // assert(totalSupply == chainmail.balanceOf(CHARLIE));
        vm.stopPrank();

        // Charlie votes
        vm.prank(CHARLIE);
        chainmail.vote(true, 0);

        Chainmail.ListingStatus status = chainmail.getListingStatus(0);
        console.log("status: ", uint256(status));
        assertTrue(status == Chainmail.ListingStatus.COMPLETED);
    }

    function testDisputeNotResolvesIfQuoramIsNotReached() external bobOpensDisputeAgainstAlice {
        vm.startPrank(msg.sender);
        uint256 toVoteWith = chainmail.totalSupply() / 2 - 100;
        chainmail.transfer(CHARLIE, toVoteWith);
        // assert(totalSupply == chainmail.balanceOf(CHARLIE));
        vm.stopPrank();

        // Charlie votes
        vm.prank(CHARLIE);
        chainmail.vote(true, 0);

        Chainmail.ListingStatus status = chainmail.getListingStatus(0);
        console.log("status: ", uint256(status));
        assertTrue(status == Chainmail.ListingStatus.DISPUTED);
    }
}
