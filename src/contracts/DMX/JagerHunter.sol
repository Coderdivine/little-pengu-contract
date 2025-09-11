// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { JagerHunterBaseToken } from "./JagerHunterBaseToken.sol";

contract JagerHunter is JagerHunterBaseToken
{
     constructor()
        JagerHunterBaseToken(
            //SwapRouter
            address(0x5b30fAE7bf5e68398fe9bC2Daac70A47d510EBea),
            // Name
            unicode"DMX Token",
            // Symbol
            unicode"DMX",
            //Decimals
            18,
            // Supply
            146_00_0000_0000_0000,
            // FundAddress
            address(0xa2FE19fFC2e1A49268cA31b47ccf94971BC4b54F),
             // airdropAddress: Normal Address
            address(0xEDfd2aa1a997DEf83585907b43f6461456e9d582),
             // cexAddress
            address(0xfE7A8CEf4Df1b0433223F9D677294E30843f4688),
             // marketAddress
            address(0x1Fb03f8Ef651A79C7479a842DB648593cC9A5E86),
              // liquidityAddress: Normal Address
            address(0xd85D2e17190900df7AA7bce9A8a7E2D678D8b4E9),
            // sign: Normal Address
            address(0xe55B483bdD51F155f6Eb4C2151BC9FA6bE9Ff51A)
        )
    {}
}