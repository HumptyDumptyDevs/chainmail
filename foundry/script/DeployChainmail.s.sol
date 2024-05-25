//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Script, console} from "forge-std/Script.sol";
import {Chainmail} from "../src/Chainmail.sol";
import {Verifier} from "../src/Verifier.sol";
import {ChainmailDao} from "../src/ChainmailDao.sol";

contract DeployChainmail is Script {
    Verifier verifier;
    Chainmail chainmail;
    ChainmailDao dao;

    uint256 public constant stakeOfAuthenticity = 0.1 ether;

    function run() external returns (Chainmail, Verifier, ChainmailDao) {
        vm.startBroadcast();
        verifier = new Verifier();
        dao = new ChainmailDao();
        chainmail = new Chainmail(address(verifier), stakeOfAuthenticity, address(dao));
        vm.stopBroadcast();
        return (chainmail, verifier, dao);
    }
}
