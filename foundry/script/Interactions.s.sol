//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Script, console} from "forge-std/Script.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";
import {Chainmail} from "../src/Chainmail.sol";
import {Constants} from "./Constants.s.sol";

contract CreateListing is Script {
    function createNewListing(address _mostRecentlyDeployed) public {
        Constants constants = new Constants();
        Chainmail chainmail = Chainmail(_mostRecentlyDeployed);
        Chainmail.Proof memory proof = constants.getProof();

        string memory description = "This is a test listing";
        uint256 price = 1 ether;

        uint256 stakeOfAuthenticity = chainmail.getStakeOfAuthenticity();

        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));

        chainmail.createListing{value: stakeOfAuthenticity}(
            proof,
            description,
            price
        );

        vm.stopBroadcast();
    }

    function run() external {
        console.log("!!! hello");

        address payable mostRecentlyDeployed = payable(
            DevOpsTools.get_most_recent_deployment("Chainmail", block.chainid)
        );

        createNewListing(mostRecentlyDeployed);
    }
}
