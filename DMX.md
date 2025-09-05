# JagerHunter Contract Guide - Constructor Parameters & Functions

## Contract Overview

**JagerHunterBaseToken** is an advanced ERC20 token contract with built-in trading fees, automatic liquidity provision, holder rewards distribution, and burn mechanisms. It's designed as a deflationary token with sophisticated DeFi features.

## Constructor Parameters Explained

When deploying the JagerHunter contract, you need to provide these 11 parameters:

### 1. RouterAddress (address)
- **Purpose:** Uniswap/PancakeSwap router contract address
- **BSC Example:** `0x10ED43C718714eb63d5aA57B78B54704E256024E` (PancakeSwap Router)
- **What it does:** Enables automatic swapping and liquidity operations

### 2. Name (string)  
- **Purpose:** Token name
- **Example:** `"Jager Hunter"`
- **What it does:** Sets the human-readable token name

### 3. Symbol (string)
- **Purpose:** Token symbol/ticker
- **Example:** `"Jager"`
- **What it does:** Sets the short token identifier

### 4. Decimals (uint8)
- **Purpose:** Token decimal places
- **Example:** `18`
- **What it does:** Determines token precision (18 = standard ERC20)

### 5. Supply (uint256)
- **Purpose:** Total token supply (before decimals)
- **Example:** `146_00_0000_0000_0000` (146 quadrillion)
- **What it does:** Total tokens to be minted

### 6. FundAddress (address)
- **Purpose:** Treasury/development wallet
- **Example:** `0xaf5FFa64b0421B4D1e400cad8f2E4B6BA6fbE5b9`
- **What it does:** Receives fund fees from transactions

### 7. airdropAddress (address)
- **Purpose:** Airdrop wallet
- **Example:** `0x64981BFAc88b2CCFa7d9627387521161D2b89DB0`
- **What it does:** Receives 90.5% of total supply for airdrops

### 8. cexAddress (address)
- **Purpose:** Centralized exchange wallet
- **Example:** `0xc7950E38946393d0EAe08F3Ea67F69F54f632754`
- **What it does:** Receives 4% of total supply for CEX listings

### 9. marketAddress (address)
- **Purpose:** Marketing wallet
- **Example:** `0xB69Af387475195107EDc435A6346f606428A9187`
- **What it does:** Receives 5.4% of total supply for marketing

### 10. liquidityAddress (address)
- **Purpose:** Initial liquidity provider
- **Example:** `0x43567a33FC0D8c90C8f5FCfE5752906CbeC79E84`
- **What it does:** Receives 0.1% of total supply for initial LP

### 11. sign (address)
- **Purpose:** Signature verification address for FeeDistributor
- **Example:** `0x6999b70785EcE5d4B885E9345202fb832a08D3E8`
- **What it does:** Used for secure reward claims in FeeDistributor

## Token Distribution Breakdown

| Wallet | Percentage | Purpose |
|--------|------------|---------|
| Airdrop | 90.5% | Community airdrops |
| Marketing | 5.4% | Marketing campaigns |
| CEX | 4.0% | Exchange listings |
| Liquidity | 0.1% | Initial LP provision |

## Fee Structure Constants

The contract has hardcoded fee percentages:

### Transaction Fees
- **Pre-launch (14 days):** 10% total fee
- **Post-launch:** 5% total fee

### Fee Distribution (out of collected fees)
- **Holder Rewards:** 50% (5000/10000)
- **Liquidity Pool:** 20% (2000/10000)  
- **Burn:** 16% (1600/10000)
- **Fund/Treasury:** 14% (1400/10000)

## Key Public Variables (READ Functions)

### Basic Token Info
```solidity
function name() public view returns (string memory)
function symbol() public view returns (string memory)  
function decimals() public view returns (uint8)
function totalSupply() public view returns (uint256)
function balanceOf(address account) public view returns (uint256)
```

### Contract Specific Info
```solidity
function startTime() public view returns (uint256)
// Returns contract deployment timestamp

function minTaxDistributionThreshold() public view returns (uint256)  
// Minimum tokens needed before fee distribution (100M tokens)

function getCirculatingSupply() public view returns (uint256)
// Total supply minus burned tokens

function fundAddres() public view returns (address)
// Treasury wallet address

function mainPair() public view returns (address)
// Primary trading pair address (Token/WBNB)

function weth() public view returns (address)
// WETH/WBNB address

function feeDistributor() public view returns (address)
// FeeDistributor contract address
```

### Mappings (Status Checkers)
```solidity
function swapPairList(address) public view returns (bool)
// Check if address is a trading pair

function swapRouters(address) public view returns (bool)  
// Check if address is approved router

function feeWhiteList(address) public view returns (bool)
// Check if address is exempt from fees
```

## Key Functions (WRITE Functions)

### Standard ERC20 Functions
```solidity
function transfer(address to, uint256 amount) public returns (bool)
function transferFrom(address sender, address recipient, uint256 amount) public returns (bool)
function approve(address spender, uint256 amount) public returns (bool)
function increaseAllowance(address spender, uint256 addedValue) public returns (bool)
function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool)
```

### Liquidity Management Functions
```solidity
function addLiquidity(uint256 amount) public payable returns (uint amountToken, uint amountETH, uint liquidity)
// Add liquidity to the main pair (requires ETH/BNB)

function removeLiquidity(uint256 liquidity) public returns (uint amountToken, uint amountETH)
// Remove liquidity from the main pair
```

### Owner-Only Admin Functions
```solidity
function setSwapPairList(address addr, bool enable) external onlyOwner
// Add/remove trading pairs

function setSwapRouter(address addr, bool enable) external onlyOwner
// Add/remove approved routers

function batchSetFeeWhiteList(address[] memory addr, bool enable) external onlyOwner
// Batch add/remove fee exemptions

function setExcludeHoldProvider(address[] memory addr, bool enable) external onlyOwner  
// Exclude addresses from holder rewards

function transferOwnership(address newOwner) public onlyOwner
// Transfer contract ownership

function renounceOwnership() public onlyOwner
// Renounce ownership (makes contract immutable)
```

## How The Fee System Works

### Transaction Flow
1. **Normal Transfer:** No fees applied
2. **Trading Transfer:** (buy/sell on DEX) Fees applied
3. **Fee Collection:** Fees accumulate in contract
4. **Auto Distribution:** When threshold reached, fees are:
   - Swapped to ETH/BNB
   - Distributed to fund wallet
   - Added to liquidity
   - Sent to FeeDistributor for holder rewards
   - Burned (deflationary mechanism)

### Fee Timing
- **First 14 days:** 10% fee on trades
- **After 14 days:** 5% fee on trades
- **Whitelist:** No fees for whitelisted addresses

## Security Features

### Access Control
- **Owner Functions:** Protected by `onlyOwner` modifier
- **Reentrancy Protection:** `nonReentrant` on critical functions
- **Fee Whitelist:** Prevents fees on internal operations

### Safety Mechanisms
- **Try/Catch:** Liquidity operations wrapped in error handling
- **Balance Checks:** Prevents excessive transfers
- **Address Validation:** Prevents zero address operations

## Integration Notes for Your DMX Project

To adapt this for DMX token:

1. **Change Token Details:** Update name, symbol, supply
2. **Adjust Fee Structure:** Modify fee percentages if needed
3. **Update Distribution:** Change wallet allocation percentages
4. **Network Specific:** Use correct router address for your target chain
5. **Customize Features:** Add XRWA integration for your fundraising model

## Compilation Requirements

- **Solidity Version:** 0.8.21
- **Required Imports:** OpenZeppelin contracts, Uniswap interfaces
- **Dependencies:** FeeDistributor contract must be deployable
- **Network:** BSC/Ethereum compatible chains

This contract serves as an excellent foundation for your DMX token project with its sophisticated fee distribution and deflationary mechanisms.