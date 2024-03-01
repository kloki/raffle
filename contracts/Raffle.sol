//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Raffle {
    address public owner;
    address[] public participants;

    constructor() {
        owner = msg.sender;
    }

    function join() public {
        require(msg.sender != owner, "Cannot join your own raffle");
        for (uint i = 0; i < participants.length; i++) {
            require(msg.sender != participants[i], "Cannot join raffle twice");
        }
        participants.push(msg.sender);
    }

}
