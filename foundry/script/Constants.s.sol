//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Script, console} from "forge-std/Script.sol";
import {Chainmail} from "../src/Chainmail.sol";

contract Constants is Script {
    Chainmail.Proof private proof;

    constructor() {
        proof = setProofs();
    }

    function getProof() public view returns (Chainmail.Proof memory) {
        return proof;
    }

    function setProofs() private pure returns (Chainmail.Proof memory) {
        uint256[3] memory pi_a = [
            14715168981146962350041016503840209055554233030683459780168601831491658434694,
            1455497781806646100831766168818005993397175519437262328891049625003420928041,
            1
        ];

        uint256[2][3] memory pi_b = [
            [
                18423276588022139653735887529211129827315609124754837730038860440095438892855,
                14260885639852224426628171663122028284350588902291624468922451599726063038696
            ],
            [
                15362729451731351297728022962251385224020695042407249868878614217688220105436,
                617910774965793780933856918209409911364081855759470430387432984778638516360
            ],
            [uint256(1), uint256(0)]
        ];

        uint256[3] memory pi_c = [
            20597579593505353854282148195033734311481494714828155370423167200866252431326,
            3218598669396640992679106836760618261685021296240654111220524258863140517068,
            1
        ];

        string memory protocol = "groth16";
        string memory curve = "bn128";

        uint256[6] memory pubSignals = [
            6632353713085157925504008443078919716322386156160602218536961028046468237192,
            212368576930448930273183056156899939747904896008418136071560125284137064802,
            4855573514743150963552886208617,
            175855437036280884308966790332701395812089398063480157420483944,
            148148873981201281813561602926187929939,
            986099429885447110511085869281282886479416652540
        ];

        return
            Chainmail.Proof({
                pi_a: pi_a,
                pi_b: pi_b,
                pi_c: pi_c,
                protocol: protocol,
                curve: curve,
                pubSignals: pubSignals
            });
    }
}
