//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Script, console} from "forge-std/Script.sol";
import {Chainmail} from "../src/Chainmail.sol";
import {Verifier} from "../src/Verifier.sol";

contract DeployChainmail is Script {
    Verifier verifier;
    Chainmail chainmail;

    uint256 public constant stakeOfAuthenticity = 0.1 ether;

    function run() external returns (Chainmail, Verifier) {
        vm.startBroadcast();
        verifier = new Verifier();
        chainmail = new Chainmail(address(verifier), stakeOfAuthenticity);
        vm.stopBroadcast();
        return (Chainmail, Verifier);
    }
}
