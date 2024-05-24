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
            1525735855019193882620577579105480236011241627605972267828858947665318228175,
            13208318365303717130490690075530044810189715400655243435295601120663584055391,
            1
        ];

        uint256[2][3] memory pi_b = [
            [
                16099325666902365830716731538369798613269004993482833029570878207984519247924,
                14586881371718949173378136703379284737092927615424705604033344219659314088702
            ],
            [
                18219456061871526817845236743457548192732831178860286220383762105683770225960,
                17308465678969869873615530383823185197957737700315279535122002052497613399015
            ],
            [uint256(1), uint256(0)]
        ];

        uint256[3] memory pi_c = [
            8070222992747409853975372099600537439302901701676875765884106276919078720325,
            21176862153893371898622856762607855201697174723040504047728198747359345393356,
            1
        ];

        string memory protocol = "groth16";
        string memory curve = "bn128";

        uint256[5] memory pubSignals = [
            6632353713085157925504008443078919716322386156160602218536961028046468237192,
            212368576930448930273183056156899939747904896008418136071560125284137064802,
            4855573514743150963552886208617,
            175855437036280884308966790332701395812089398063480157420483944,
            1390849295786071768276380950238675083608645509734
        ];

        return Chainmail.Proof({
            pi_a: pi_a,
            pi_b: pi_b,
            pi_c: pi_c,
            protocol: protocol,
            curve: curve,
            pubSignals: pubSignals
        });
    }
}
