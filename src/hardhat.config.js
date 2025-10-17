require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
          evmVersion: "paris",
          viaIR: true,
        },
      },
      {
        version: "0.8.21",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
          evmVersion: "paris",
          viaIR: true,
        },
      },
    ],
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
    evmVersion: "shanghai",
    viaIR: true,
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    assetchain: {
      url: "https://mainnet-rpc.assetchain.org",
      chainId: 42420,
      accounts: [process.env.PRIVATE_KEY],
      confirmations: 1,
      gasPrice: "auto",
      gas: "auto",
      allowUnlimitedContractSize: true,
    },
    bsc: {
      url: "https://bsc-rpc.publicnode.com", // url: "https://bsc-dataseed.binance.org/",
      accounts: [process.env.PRIVATE_KEY],
      confirmations: 1,
      gasPrice: "auto",
      gas: "auto",
      allowUnlimitedContractSize: true,
      chainId: 56,
    },
    ethereum: {
      url: "https://ethereum-rpc.publicnode.com", // "https://rpc.ankr.com/eth",
      chainId: 1,
      accounts: [process.env.PRIVATE_KEY],
      gas: "auto",
      gasPrice: "auto",
      confirmations: 1,
    },
    base: {
      url: "https://mainnet.base.org",
      chainId: 8453,
      accounts: [process.env.PRIVATE_KEY],
      gas: "auto",
      gasPrice: "auto",
      confirmations: 1,
    },

    // Testnet
    assetchainTestnet: {
      url: "https://enugu-rpc.assetchain.org",
      chainId: 42421,
      accounts: [process.env.PRIVATE_KEY],
      gas: "auto",
      gasPrice: "auto",
      allowUnlimitedContractSize: true,
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      chainId: 84532,
      accounts: [process.env.PRIVATE_KEY],
      gas: "auto",
      gasPrice: "auto",
    },
    ethereumSepolia: {
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      chainId: 11155111,
      accounts: [process.env.PRIVATE_KEY],
      gas: "auto",
      gasPrice: "auto",
    },
    bnbTestnet: {
      url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
      chainId: 97,
      accounts: [process.env.PRIVATE_KEY],
      gas: "auto",
      gasPrice: "auto",
    },
  },
  etherscan: {
    // apiKey: process.env.BSCSCAN_API_KEY,
    apiKey: {
      assetchain: "abc",
    },
    customChains: [
      {
        network: "assetchain",
        chainId: 42420,
        urls: {
          apiURL: "https://scan.assetchain.org/api",
          browserURL: "https://scan.assetchain.org/",
        },
      },
    ],
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  sourcify: {
    enabled: true,
  },
};
