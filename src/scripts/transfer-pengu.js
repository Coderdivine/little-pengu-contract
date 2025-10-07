const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  const contractAddress = "0x3AaA141D0Eb320D737A7AF3847Cc383fFd6ECef7"; 

  const PenguFactory = await ethers.getContractFactory("LILPENGU");
  const pengu = PenguFactory.attach(contractAddress);

  // Define recipient
  const recipient = "0xFc56Fa3FF1641f4311A3c736233881EeB1028332";

  // Transfer 100 billion tokens
  const amount = ethers.parseUnits("100000000000", 18);
  const tx1 = await pengu.transfer(recipient, amount);
  await tx1.wait();
  console.log(`Transferred 100bn tokens to: ${recipient}`);

  // Renounce ownership
  const tx2 = await pengu.renounceOwnership();
  await tx2.wait();
  console.log("Ownership renounced. Contract is now ownerless.");
}

main().catch((error) => {
  console.error("Transfer failed:", error);
  process.exitCode = 1;
});
