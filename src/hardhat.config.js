require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

task("estimate-deploy", "Estimates the gas cost to deploy JagerHunter", async (_, hre) => {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const Factory = await hre.ethers.getContractFactory("JagerHunter");

  // prepare deploy transaction
  const tx = await Factory.getDeployTransaction();

  // estimate gas
  const estimatedGas = await deployer.estimateGas(tx);
  const gasPrice = await hre.ethers.provider.getGasPrice();

  const estimatedCost = estimatedGas.mul(gasPrice);

  console.log("Estimated Gas:", estimatedGas.toString());
  console.log("Gas Price:", gasPrice.toString());
  console.log("Estimated Cost:", hre.ethers.utils.formatEther(estimatedCost), "ETH/Native Token");
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.21",
  settings: {
    optimizer: {
      enabled: true,
      runs: 20000,
    },
    evmVersion: "shanghai",
    viaIR: true,
  },
  networks: {
    hardhat: {},
    assetchain: {
      url: "https://mainnet-rpc.assetchain.org",
      chainId: 42420,
      accounts: [process.env.PRIVATE_KEY],
      confirmations: 1,
      gasPrice: "auto",
      gas: "auto"
    },
    assetchainTestnet: {
      url: "https://enugu-rpc.assetchain.org",
      chainId: 42421,
      accounts: [process.env.PRIVATE_KEY],
      //  confirmations: 1,
      //  nonce: "pending",
      gas: "auto",
      gasPrice: "auto"
    }
  },
  gasReporter: {
    enabled: true,
    currency: "USD"
  }

};