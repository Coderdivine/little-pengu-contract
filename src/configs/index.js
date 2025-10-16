// CONFIG.js
const CONFIG = {
  // ---------- MAINNETS ----------
  bsc: {
    oracle: "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE", // BNB/USD
    usdt: "0x55d398326f99059fF775485246999027B3197955",
    usdc: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    saleToken: "0x3AaA141D0Eb320D737A7AF3847Cc383fFd6ECef7",
    minTokenToBuy: 1,
  },
  assetchain: {
    oracle: "0xD708c5B2f159Aceb05629243D0FC6baF5aDFE483",
    usdt: "0x26E490d30e73c36800788DC6d6315946C4BbEa24",
    usdc: "0x2B7C1342Cc64add10B2a79C8f9767d2667DE64B2",
    saleToken: "0x3AaA141D0Eb320D737A7AF3847Cc383fFd6ECef7",
    minTokenToBuy: 1,
  },
  ethereum: {
    oracle: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", // ETH/USD
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    saleToken: "0xB5F20B4AEbeA14424E0b5A031745ED4DD3eE4f9e",
    minTokenToBuy: 1,
  },
  base: {
    oracle: "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70", // ETH/USD
    usdt: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
    usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    saleToken: "0xBD5db27CebAbCc4AC7e57050556840955E47c01A",
    minTokenToBuy: 1,
  },
  

  // ---------- TESTNETS ----------
  bnbTestnet: {
    oracle: "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526", // BNB/USD
    usdt: "0xa8fD6920B23f0a625914c8f12361E89930BeeD59",
    usdc: "0xa8fD6920B23f0a625914c8f12361E89930BeeD59",
    saleToken: "0x48065f4c6A22a1075851f1879699bF19367ee459", // LILPENGU testnet
    minTokenToBuy: 1,
  },

  ethereumSepolia: {
    oracle: "0x694AA1769357215DE4FAC081bf1f309aDC325306", // ETH/USD
    usdt: "0xA6DD6B4bEDB144B266C3c6607BA3102828D194e9",
    usdc: "0xA6DD6B4bEDB144B266C3c6607BA3102828D194e9",
    saleToken: "0xB5F20B4AEbeA14424E0b5A031745ED4DD3eE4f9e",
    minTokenToBuy: 1,
  },

  baseSepolia: {
    oracle: "0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1", // ETH/USD
    usdt: "0xa18BBF0e8e1242fF23d1033756bABF3d82dAB00E",
    usdc: "0xa18BBF0e8e1242fF23d1033756bABF3d82dAB00E",
    saleToken: "0xBD5db27CebAbCc4AC7e57050556840955E47c01A",
    minTokenToBuy: 1,
  },

  assetchainTestnet: {
    oracle: "0x9fd12A214AFC063158eFc1E96Ee07b93c385af2e",
    usdt: "0x469aaCCad4f38c989518159686cd654B65439321",
    usdc: "0x469aaCCad4f38c989518159686cd654B65439321",
    saleToken: "0xCeA9acb382125657776689f18e9d1c985eb9c3C7",
    minTokenToBuy: 1,
  },
};

const EXPLORERS = {
  bsc: "https://bscscan.com/tx/",
  bnbTestnet: "https://testnet.bscscan.com/tx/",
  ethereum: "https://etherscan.io/tx/",
  ethereumSepolia: "https://sepolia.etherscan.io/tx/",
  baseSepolia: "https://sepolia.basescan.org/tx/",
  assetchain: "https://scan.assetchain.org/tx/",
  assetchainTestnet: "https://scan-testnet.assetchain.org/tx/",
};


module.exports = { CONFIG, EXPLORERS };
