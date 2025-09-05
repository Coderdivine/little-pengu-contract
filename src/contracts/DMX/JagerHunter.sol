// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { JagerHunterBaseToken } from "./JagerHunterBaseToken.sol";

contract JagerHunter is JagerHunterBaseToken
{
     constructor()
        JagerHunterBaseToken(
            //SwapRouter
            address(0x10ED43C718714eb63d5aA57B78B54704E256024E),
            // Name
            unicode"JDMX",
            // Symbol
            unicode"DMX",
            //Decimals
            18,
            //  Supply
            146_00_0000_0000_0000,
            // FundAddress
            address(0xaf5FFa64b0421B4D1e400cad8f2E4B6BA6fbE5b9),
             // airdropAddress
            address(0x64981BFAc88b2CCFa7d9627387521161D2b89DB0),
             // cexAddress
            address(0xc7950E38946393d0EAe08F3Ea67F69F54f632754),
             // marketAddress
            address(0xB69Af387475195107EDc435A6346f606428A9187),
              // liquidityAddress
            address(0x43567a33FC0D8c90C8f5FCfE5752906CbeC79E84),
            // sign
            address(0x6999b70785EcE5d4B885E9345202fb832a08D3E8)
        )
    {}
}