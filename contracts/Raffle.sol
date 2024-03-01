//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Raffle {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

}
