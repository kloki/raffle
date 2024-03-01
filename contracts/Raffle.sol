//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Raffle {
    address public owner;
    address[] public participants;
    bool public is_closed;
    address public winner;

    constructor() {
        owner = msg.sender;
        is_closed = false;
    }

    function join() public {
        require(!is_closed, "Raffle is closed");
        require(msg.sender != owner, "Can't join your own raffle");
        for (uint i = 0; i < participants.length; i++) {
            require(msg.sender != participants[i], "Can't join raffle twice");
        }
        participants.push(msg.sender);
    }

    function size() public view returns (uint) {
        return participants.length;

    }

    function finalize() public {
        require(!is_closed, "Raffle is already closed");
        require(msg.sender == owner, "Only owner can finalize");
        require(participants.length > 0, "No participants");
        is_closed = true;
        // This is could be exploited by a miner controlling the timestamp
        uint randomnumber = (uint(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    msg.sender,
                    participants.length
                )
            )
        ) % participants.length);
        winner = participants[randomnumber];

    }
    function get_winner() public view returns (address) {
        require(is_closed, "Raffle is still open");
        return winner;

    }
}
