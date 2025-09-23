require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000
          },
          evmVersion: "paris",
          viaIR: true
        }
      },
      {
        version: "0.8.21",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000
          },
          evmVersion: "paris",
          viaIR: true
        }
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
      allowUnlimitedContractSize: true
    },
    assetchain: {
      url: "https://mainnet-rpc.assetchain.org",
      chainId: 42420,
      accounts: [process.env.PRIVATE_KEY],
      confirmations: 1,
      gasPrice: "auto",
      gas: "auto",
      allowUnlimitedContractSize: true
    },
    assetchainTestnet: {
      url: "https://enugu-rpc.assetchain.org",
      chainId: 42421,
      accounts: [process.env.PRIVATE_KEY],
      gas: "auto",
      gasPrice: "auto",
      allowUnlimitedContractSize: true
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
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
};
