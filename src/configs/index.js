const CONFIG = {
  // --------- MAINNETS ----------
  bsc: {
    oracle: "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE",
    usdt: "0x55d398326f99059fF775485246999027B3197955",
    usdc: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    saleToken: "0x3AaA141D0Eb320D737A7AF3847Cc383fFd6ECef7",
    minTokenToBuy: 1,
  },
  ethereum: {
    oracle: "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419",
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    saleToken: "0x3AaA141D0Eb320D737A7AF3847Cc383fFd6ECef7",
    minTokenToBuy: 1,
  },
  assetchain: {
    oracle: "0x0000000000000000000000000000000000000000", // Update when available
    usdt: "0x0000000000000000000000000000000000000000", // Update when available
    usdc: "0x0000000000000000000000000000000000000000", // Update when available
    saleToken: "0x3AaA141D0Eb320D737A7AF3847Cc383fFd6ECef7",
    minTokenToBuy: 1,
  },

  // --------- TESTNETS ----------
  bnbTestnet: {
    oracle: "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7",
    usdt: "0xA11c8D9DC9b66E209Ef60F0C8D969D3CD988782c",
    usdc: "0x64544969ed7EBf5f083679233325356EbE738930",
    saleToken: "0x3AaA141D0Eb320D737A7AF3847Cc383fFd6ECef7",
    minTokenToBuy: 1,
  },
  ethereumSepolia: {
    oracle: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    usdt: "0x4F6A43Ad7c350Fc67b6cCb7A1A0E6957f1E9b1A1",
    usdc: "0xD1d2b41D60Dd64F184bB4eB69C6aC21A5cDdc476",
    saleToken: "0x3AaA141D0Eb320D737A7AF3847Cc383fFd6ECef7",
    minTokenToBuy: 1,
  },
  baseSepolia: {
    oracle: "0xD2fCb7d3B9F7F5F9c86aC2Ef3c9129E6f0e45a2C",
    usdt: "0xB6aE2CDBa6239e79a98fCA9eBda26d87F08c2f2D",
    usdc: "0x058A04c40c952Af8432Ceae93C1f65135051b6e6",
    saleToken: "0x3AaA141D0Eb320D737A7AF3847Cc383fFd6ECef7",
    minTokenToBuy: 1,
  },
  assetchainTestnet: {
    oracle: "0x0000000000000000000000000000000000000000", // Update if needed
    usdt: "0x0000000000000000000000000000000000000000",
    usdc: "0x0000000000000000000000000000000000000000",
    saleToken: "0x3AaA141D0Eb320D737A7AF3847Cc383fFd6ECef7",
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