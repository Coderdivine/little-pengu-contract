const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  const ERC20Factory = await ethers.getContractFactory("StandardERC20");
  const StableCoin = await ethers.getContractFactory("MyStableCoin");

  // Presale Token DMX
  const dmx = await ERC20Factory.deploy("PreSale DMX v1", "PDMX", ethers.parseUnits("100000000000", 18));
  await dmx.waitForDeployment();
  console.log("dmx deployed at:", dmx.target);


  // FUSDT (Fake USD) - 1,000,000 tokens
  const stable = await StableCoin.deploy("Fake USD", "FUSD", 100_000_000_000);
  await stable.waitForDeployment();
  console.log("FUSD deployed at:", stable.target);


  // const dmxAddress = "0x6b43F6a3923de855F8ea815277b36593299726a3";
  // const recipient = "0x531d81b69f90Bd78D4f55495F541183B4a02b15f"; // Mobile wallet: 0x35478eCd5d5523EbfF204F60F308E335F75fcC31, Desktop wallet: 0x531d81b69f90Bd78D4f55495F541183B4a02b15f
  // const amount = ethers.parseUnits("10000000", 6);

  // const dmx = await ethers.getContractAt("StandardERC20", dmxAddress, deployer);
  // const tx = await dmx.transfer(recipient, amount);
  // await tx.wait();

  // console.log(`✅ Sent ${ethers.formatUnits(amount, 6)} DMX to ${recipient}`);
}

main().catch((error) => {
  console.error("Transaction failed:", error);
  process.exitCode = 1;
});
