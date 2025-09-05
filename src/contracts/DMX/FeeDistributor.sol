// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { TransferHelper } from "./TransferHelper.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Ownable } from "./access/Ownable.sol";
import { Counters } from "@openzeppelin/contracts/utils/Counters.sol";
import { ECDSA } from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import { JagerBnb } from "./JagerBnb.sol";

contract FeeDistributor is Ownable
{
    address public signAddress;
    using Counters for Counters.Counter;

    mapping(address => Counters.Counter) private _nonces;

    JagerBnb public immutable JagerBnbToken;
    IERC20 public immutable jagerToken;
    uint256 public  immutable bnbToJagerBnbRate = 1e8;
    mapping(address => bool) public excludeHoldProvider;
    
    event SetExcludHold(address indexed account, bool enbalbed);
    event SetSign(address indexed oldSign, address newSign);
    event Claim(address indexed account, uint256 currentNonce, uint256 jagerAmount, uint256 jagerBnbAmount);

    bytes32 private constant _PERMIT_TYPEHASH = keccak256("claim(address account,uint256 jagerAmount,uint256 jagerBnbAmount,uint256 deadline,bytes calldata sign)");

    constructor(address jager, address sign) 
    // Newly Added
    // Ownable(msg.sender)
    {
        require(jager != address(0) && sign != address(0), "ZERO ADDRESS");
        JagerBnbToken = new JagerBnb();
        jagerToken = IERC20(jager);
        signAddress = sign;
    }

    receive() external payable 
    {
        uint256 mintAmount =  msg.value * bnbToJagerBnbRate;
        JagerBnbToken.mint(address(this), mintAmount);
    }
    function setExcludeHoldProvider(address addr, bool enable) external onlyOwner 
    {
        excludeHoldProvider[addr] = enable;
        emit SetExcludHold(addr, enable);
    }
    function getUserNonce(address account) public view returns (uint256) 
    {
        return _nonces[account].current();
    }
    function claim(address account, uint256 jagerAmount, uint256 jagerBnbAmount, uint256 deadline, bytes calldata sign) external
    {
        require(account == msg.sender, "SENDER ERROR");
        require(excludeHoldProvider[account] == false, "BAN");
        require(block.timestamp <= deadline, "TIME OUT");
        require(jagerAmount > 0 || jagerBnbAmount > 0, "ZERO");

        Counters.Counter storage accountNonce = _nonces[account];
        uint256 accountCurrentNonce = accountNonce.current();
        bytes32  mHash =  keccak256(abi.encode(_PERMIT_TYPEHASH, account,  jagerAmount, jagerBnbAmount, deadline, accountCurrentNonce));
        address recoverSignAddress = ECDSA.recover(mHash, sign);
        require(recoverSignAddress == signAddress, "SIGN ERROR");
        accountNonce.increment();

        if(jagerAmount > 0)
        {
            uint256 jagerBalance = jagerToken.balanceOf(address(this));
            require(jagerBalance >= jagerAmount, "JNE");
            TransferHelper.safeTransfer(address(jagerToken), account, jagerAmount);
        }
        if(jagerBnbAmount > 0)
        {
            uint256 JagerBnbBalance = JagerBnbToken.balanceOf(address(this));
            require(JagerBnbBalance >= jagerBnbAmount, "JBNE");
            TransferHelper.safeTransfer(address(JagerBnbToken), account, jagerBnbAmount);
        }
        emit Claim(account, accountCurrentNonce, jagerAmount, jagerBnbAmount);
    }
    function claimBNB(uint256 amount) external
    { 
        require(amount > bnbToJagerBnbRate, "TO SMALL");
        uint256 sendETH = amount / bnbToJagerBnbRate;
        address owner = msg.sender;
        JagerBnbToken.burn(owner, amount);
        TransferHelper.safeTransferETH(owner,sendETH);
    }
}