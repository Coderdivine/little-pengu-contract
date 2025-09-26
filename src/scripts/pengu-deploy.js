const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  const PenguFactory = await ethers.getContractFactory("LILPENGU");

  // LITTLE PENGU Token
  const pengu = await PenguFactory.deploy();
  await pengu.waitForDeployment();
  console.log("LITTLE PENGU deployed at:", pengu.target);
}

main().catch((error) => {
  console.error("Transaction failed:", error);
  process.exitCode = 1;
});
