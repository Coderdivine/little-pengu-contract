// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Ownable } from "./access/Ownable.sol";
import { ERC20 } from "./token/ERC20/ERC20.sol";
import { IERC20 } from "./token/ERC20/IERC20.sol";
import { ReentrancyGuard } from "./security/ReentrancyGuard.sol"; 

import { IUniswapV2Router02 } from "./IUniswapV2Router02.sol";
import { IUniswapV2Factory } from "./IUniswapV2Factory.sol";
import { IUniswapV2Pair } from "./IUniswapV2Pair.sol";
import { TransferHelper } from "./TransferHelper.sol";
// import { Math } from "../Library/Math/Math.sol";

import { FeeDistributor } from "./FeeDistributor.sol";


abstract contract JagerHunterBaseToken is ERC20, ReentrancyGuard, Ownable
{
    // ERC20
    uint8 private _decimals;
    uint256 private constant MAX = ~uint256(0);
    // FEE
    uint256 private constant _preTotalFees = 1000;
    uint256 private constant _totalFees = 500;
    uint256 private constant _preDuration = 14 days;
    uint256 private constant _holdFee = 5000;
    uint256 private constant _LPFee = 2000;
    uint256 private constant _burnFee = 1600;
    uint256 private constant _fundFee = 1400;
    uint256 public immutable startTime;
    uint256 public immutable minTaxDistributionThreshold;


    //SWAP
    IUniswapV2Router02 private immutable _swapRouter;
    mapping(address => bool) public swapPairList;
    mapping(address => bool) public swapRouters;
    address public immutable weth;
    address public immutable mainPair;
    address public immutable fundAddres;
    address private constant DEAD = 0x000000000000000000000000000000000000dEaD;
    address private constant ZERO = 0x0000000000000000000000000000000000000000;


    mapping(address => bool) public feeWhiteList;
    //
    FeeDistributor public immutable feeDistributor;
    bool private inSwap;
    modifier lockTheSwap() {
        inSwap = true;
        _;
        inSwap = false;
    }

    constructor(address RouterAddress, string memory Name, string memory Symbol, uint8 Decimals, uint256 Supply, address FundAddress, address airdropAddress, address cexAddress, address marketAddress,address liquidityAddress,address sign) 
        ERC20(Name,Symbol)
    {
        require(FundAddress != address(0) && airdropAddress!= address(0) && cexAddress != address(0) && marketAddress != address(0) && liquidityAddress != address(0) && sign != address(0), "PARAMETER ERROR");
        _decimals = Decimals;
        fundAddres = FundAddress;

        _swapRouter = IUniswapV2Router02(RouterAddress);
        _approve(address(this), RouterAddress, MAX);
        swapRouters[RouterAddress] = true;

        IUniswapV2Factory swapFactory = IUniswapV2Factory(_swapRouter.factory());
        weth = _swapRouter.WETH();
        mainPair = swapFactory.createPair(address(this), weth);

        swapPairList[mainPair] = true;
        startTime = block.timestamp;

        uint256 tokenUnit = 10 ** _decimals;
        minTaxDistributionThreshold = 1e8 * tokenUnit;

        feeDistributor = new FeeDistributor(address(this),sign);
       
        setExcludeAndFeeWhite();
        mintToken(Supply * tokenUnit, airdropAddress,cexAddress, marketAddress,liquidityAddress);
    }

    function setExcludeAndFeeWhite() private
    {
        feeDistributor.setExcludeHoldProvider(fundAddres, true);
        feeDistributor.setExcludeHoldProvider(address(feeDistributor), true);
        feeDistributor.setExcludeHoldProvider(address(_swapRouter), true);
        feeDistributor.setExcludeHoldProvider(address(mainPair), true);
        feeDistributor.setExcludeHoldProvider(address(this), true);
        feeDistributor.setExcludeHoldProvider(DEAD, true);
        feeDistributor.setExcludeHoldProvider(ZERO, true);

        feeWhiteList[address(this)] = true;
        feeWhiteList[fundAddres] = true;
        feeWhiteList[address(feeDistributor)] = true;
    }

    function mintToken(uint256 supply, address airdropAddress, address cexAddress, address marketAddress,address liquidityAddress) private
    {
        feeDistributor.setExcludeHoldProvider(airdropAddress, true);
        feeDistributor.setExcludeHoldProvider(cexAddress, true);
        feeDistributor.setExcludeHoldProvider(marketAddress, true);
        feeDistributor.setExcludeHoldProvider(liquidityAddress, true);

        feeWhiteList[airdropAddress] = true;
        feeWhiteList[cexAddress] = true;
        feeWhiteList[marketAddress] = true;
        feeWhiteList[liquidityAddress] = true;

        _mint(airdropAddress, supply * 9050 / 10000);
        _mint(cexAddress, supply * 400 / 10000);
        _mint(marketAddress, supply * 540 / 10000);
        _mint(liquidityAddress, supply * 10 / 10000);
    }

    // ERC20 Functions
    function decimals() public view override returns (uint8) 
    {
        return _decimals;
    }
    function transfer(address to, uint256 amount) public override returns (bool) 
    {
        return doTransfer(_msgSender(), to, amount);
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) 
    {
        address spender = _msgSender();
        _spendAllowance(sender, spender, amount);
        return doTransfer(sender, recipient, amount);
    }
    function doTransfer(address sender, address recipient, uint256 amount) private returns (bool)
    {
        if (inSwap == true) 
        {
            _transfer(sender, recipient, amount);
            return true;
        }
        bool takeFee;

        if (feeWhiteList[sender] == false && feeWhiteList[recipient] == false && (swapPairList[sender] == true || swapPairList[recipient] == true)) 
        {
            takeFee = true;
        }

        if(inSwap == false && swapPairList[_msgSender()] == false && swapRouters[sender] == false)
        {
            doSwapFund();
        }
        uint256 amountReceived = takeFee == true ? takeTransferFee(sender, amount) : amount;
        _transfer(sender, recipient, amountReceived);
        return true;
    }
    event AddLiquidityError(uint256 addLPAmount, uint256 addLPETH);
    function doSwapFund() private lockTheSwap
    {
        uint256 taxAmount = balanceOf(address(this));

        if(taxAmount < minTaxDistributionThreshold)
            return;

        uint256 totalFee = _burnFee + _holdFee + _LPFee + _fundFee;
        uint256 burnAmount = taxAmount * _burnFee / totalFee;
        taxAmount = taxAmount - burnAmount;

        uint256 totalTokenFee = _holdFee + _LPFee;
        uint256 fundFee = _fundFee * 2;
        uint256 totalEthFee = fundFee + _holdFee + _LPFee;

        totalFee = totalTokenFee + totalEthFee;

        address[] memory swapPath = new address[](2);
        swapPath[0] = address(this);
        swapPath[1] = _swapRouter.WETH();
        uint256 swapAmount = taxAmount * totalEthFee / totalFee;
        bool success = false;
        try _swapRouter.swapExactTokensForETHSupportingFeeOnTransferTokens(swapAmount, 0, swapPath, address(this), block.timestamp)
        {
            success = true;
        } 
        catch 
        {
        }
        if (!success) 
        {
            return;
        }

        TransferHelper.safeTransfer(address(this), DEAD, burnAmount);
        uint256 beforeETH = address(this).balance;
        uint256 beforeToken =  balanceOf(address(this));
        uint256 fundETHFee = beforeETH * fundFee / totalEthFee;
        TransferHelper.safeTransferETH(fundAddres, fundETHFee);

        uint256 addLPAmount = _LPFee * beforeToken / totalTokenFee;
        uint256 addLPETH = _LPFee * beforeETH / totalEthFee;

        try _swapRouter.addLiquidityETH{value:addLPETH}(address(this), addLPAmount, 0, 0, ZERO, block.timestamp)
        {
        }
        catch
        {
            emit AddLiquidityError(addLPAmount, addLPETH);
        }
        uint256 afertETH = address(this).balance;
        uint256 afertToken =  balanceOf(address(this));

        TransferHelper.safeTransferETH(address(feeDistributor), afertETH);
        TransferHelper.safeTransfer(address(this), address(feeDistributor), afertToken);
    }
    function takeTransferFee(address sender, uint256 amount) private returns(uint256)
    {
        uint256 feeRate = startTime + _preDuration > block.timestamp ? _preTotalFees : _totalFees;
        uint256 feeAmount =  amount * feeRate / 10000;

        if(feeAmount > 0)
        {
            _transfer(sender, address(address(this)), feeAmount);
        }
        return amount - feeAmount;
    }
    function getCirculatingSupply() public view returns (uint256) {
        return totalSupply() - balanceOf(DEAD) - balanceOf(ZERO);
    }
    // HOLD 
    receive() external payable {}
    //ADMIN FUNCTIONS
    function setSwapPairList(address addr, bool enable) external onlyOwner {
        swapPairList[addr] = enable;
    }
    function setSwapRouter(address addr, bool enable) external onlyOwner {
        swapRouters[addr] = enable;
    }
    function batchSetFeeWhiteList(address[] memory addr,bool enable) external onlyOwner {
        for (uint i = 0; i < addr.length; i++) {
            feeWhiteList[addr[i]] = enable;
        }
    }
    function setExcludeHoldProvider(address[] memory addr,bool enable) external onlyOwner 
    {
         for (uint i = 0; i < addr.length; i++) {
           feeDistributor.setExcludeHoldProvider(addr[i], enable);
        }
    }
    // Liquidity
    function addLiquidity(uint256 amount) public payable lockTheSwap nonReentrant returns(uint amountToken,uint amountETH, uint liquidity)
    { 
        uint256 ethAmount = msg.value;
        require(ethAmount > 0 && amount > 0, "ZERO");
        TransferHelper.safeTransferFrom(address(this), msg.sender, address(this), amount);
        bool success = false;

        try _swapRouter.addLiquidityETH{ value: ethAmount }(address(this), amount, 0, 0, msg.sender, block.timestamp) returns (uint _amountToken, uint _amountETH, uint _liquidity)
        {
            amountToken = _amountToken;
            amountETH = _amountETH;
            liquidity = _liquidity;
            success = true;
        }
        catch
        {
            amountToken = 0;
            amountETH = 0;
            liquidity = 0;
            success = false;
        }

        require(success == true, "ADD LIQUIDITY FAILED");
        require(amountETH <= ethAmount && amountToken <= amount, "AMOUNT ERR");

        if(ethAmount > amountETH)
             TransferHelper.safeTransferETH(msg.sender, ethAmount - amountETH);
        
        if(amount > amountToken)
            TransferHelper.safeTransfer(address(this), msg.sender, amount - amountToken);
    }
    
    function removeLiquidity(uint256 liquidity) public lockTheSwap nonReentrant returns (uint amountToken, uint amountETH)
    {
        require(liquidity > 0, "ZERO LIQUIDITY");
        TransferHelper.safeTransferFrom(mainPair, msg.sender, address(this), liquidity);
        TransferHelper.safeApprove(mainPair, address(_swapRouter), liquidity);
        bool success = false;
        try _swapRouter.removeLiquidityETH(address(this), liquidity, 0, 0, msg.sender, block.timestamp) returns (uint _amountToken, uint _amountETH)
        {
            amountToken = _amountToken;
            amountETH = _amountETH;
            success = true;
        } 
        catch 
        {
            amountToken = 0;
            amountETH = 0;
            success = false;
        }
        require(success == true, "REMOVE LIQUIDITY FAILED");
    }
}