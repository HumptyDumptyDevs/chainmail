//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {DeployChainmail} from "../../script/DeployChainmail.s.sol";
import {Chainmail} from "../../src/Chainmail.sol";
import {Verifier} from "../../src/Verifier.sol";
import {Constants} from "../../script/Constants.s.sol";
import {ChainmailDao} from "../../src/ChainmailDao.sol";

contract ChainmailTest is Test {
    Chainmail public chainmail;
    Verifier public verifier;
    Constants public constants;
    ChainmailDao public dao;

    Chainmail.Proof public proof;

    address ALICE = vm.addr(vm.envUint("PRIVATE_KEY"));
    address BOB = makeAddr("BOB");

    uint256 public stakeOfAuthenticity;
    uint256 public listingTimeLimit;
    uint256 public expirationReward;
    uint256 public expirationRewardDivisor;

    uint256 constant STARTING_BALANCE = 100 ether;

    bytes bobPublicKeyBytes = abi.encodePacked(
        "-----BEGIN PGP PUBLIC KEY BLOCK-----\n",
        "xjMEZjjbMhYJKwYBBAHaRw8BAQdAXTlwKlKKR/pD08qbHm7IdvYVPxmJNIll\n",
        "LC7QjPJduXXNKjB4MDdGQmMzMGE3ZDU2NEVGNzJFYjBBMzMxOGM3Mzg1MzU3\n",
        "OTg5M0I2NcKMBBAWCgA+BYJmONsyBAsJBwgJkHOmxvJgIORuAxUICgQWAAIB\n",
        "AhkBApsDAh4BFiEE+SqOP+poOR2fuGBXc6bG8mAg5G4AAHVWAP9Q3kF2Am0L\n",
        "jKufBp6xX4cCUylSsCcwnMn2NYkeRZwuVAD+PE9Xxc6OW2Y5sSNWYuv9uMqL\n",
        "Ya54OYLNf4VF/y9cJQfOOARmONsyEgorBgEEAZdVAQUBAQdAvdRn/4Ko3W7U\n",
        "EqV6pR8VAYucNwfP5AXwEQYVlXLYzm0DAQgHwngEGBYKACoFgmY42zIJkHOm\n",
        "xvJgIORuApsMFiEE+SqOP+poOR2fuGBXc6bG8mAg5G4AAFEvAQC7cC3r3MjE\n",
        "WGQMtU/U5aNfpxgVk6ZpgkpyG5DfvHLPqQEA6AYq45VYKVfxALfoxn2X2567\n",
        "xSEZ36k+zgoJb9q62wg=\n",
        "=UpEK\n",
        "-----END PGP PUBLIC KEY BLOCK-----\n"
    );

    bytes32 bobPublicKeyHashed = keccak256(bobPublicKeyBytes);

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
        (chainmail, verifier, dao) = deploy.run();
        constants = new Constants();
        proof = constants.getProof();

        stakeOfAuthenticity = chainmail.getStakeOfAuthenticity();

        vm.deal(ALICE, STARTING_BALANCE);
        vm.deal(BOB, STARTING_BALANCE);
    }

    modifier aliceCreatesListing() {
        string memory description = "This contains an email that says hello";

        uint256 price = 1 ether;

        vm.prank(ALICE);
        chainmail.createListing{value: stakeOfAuthenticity}(proof, description, price);

        _;
    }
}
