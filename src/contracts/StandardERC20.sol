// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title Simple ERC20 Token
/// @notice Generic ERC20 token that mints total supply to the deployer
contract StandardERC20 is ERC20 {
    constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) {
        // initialSupply is passed in with 18 decimals
        _mint(msg.sender, initialSupply);
    }
}
