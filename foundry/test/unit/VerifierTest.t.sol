//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {Verifier} from "../../src/Verifier.sol";
import {DeployChainmail} from "../../script/DeployChainmail.s.sol";
import {Chainmail} from "../../src/Chainmail.sol";
import {Constants} from "../../script/Constants.s.sol";

contract VerfierTest is Test {
    Verifier verifier;
    Chainmail chainmail;
    Constants constants;

    Chainmail.Proof public proof;

    function setUp() external {
        DeployChainmail deploy = new DeployChainmail();
        constants = new Constants();
        proof = constants.getProof();

        (chainmail, verifier) = deploy.run();
    }

    function testIsVerifierDeployed() external view {
        console.log("verifier address: ", address(verifier));
        assertNotEq(address(verifier), address(0x0));
    }

    function testVerifyProof() external view {
        uint256[6] memory pubSignals = proof.pubSignals;
        uint256[2] memory proof_a = [proof.pi_a[0], proof.pi_a[1]];
        uint256[2][2] memory proof_b = [[proof.pi_b[0][1], proof.pi_b[0][0]], [proof.pi_b[1][1], proof.pi_b[1][0]]];
        uint256[2] memory proof_c = [proof.pi_c[0], proof.pi_c[1]];

        bool result = verifier.verifyProof(proof_a, proof_b, proof_c, pubSignals);
        console.log("result: ", result);
        assertTrue(result);
    }
}
