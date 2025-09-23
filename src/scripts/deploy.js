const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const JagerHunter = await ethers.getContractFactory("JagerHunter");

  const contract = await JagerHunter.deploy({
    gasLimit: 9_000_000,
  });

  await contract.waitForDeployment();

  console.log("JagerHunter deployed to:", contract.target || contract.address);

  const tx = await contract.initializeSwap();
  console.log("initializeSwap Tx sent, hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("initializeSwap transaction confirmed, status:", receipt.status);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment + init failed:", error);
    process.exit(1);
  });
