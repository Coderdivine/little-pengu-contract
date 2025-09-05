// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract JagerBnb is ERC20, Ownable
{
    constructor() ERC20("DMX", "DMX")
    Ownable(msg.sender)
    {}

    function mint(address account, uint256 amount) external onlyOwner 
    {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) external onlyOwner 
    {
        _burn(account, amount);
    }
}