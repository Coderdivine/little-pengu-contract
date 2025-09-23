const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const oracle = "0x9fd12A214AFC063158eFc1E96Ee07b93c385af2e";
  const usdt = "0x469aaCCad4f38c989518159686cd654B65439321";
  const usdc = "0x469aaCCad4f38c989518159686cd654B65439321";
  const saleToken = "0xCeA9acb382125657776689f18e9d1c985eb9c3C7";
  const minTokenToBuy = 1;

  console.log("Deploying LILPEPE_Presale...");

  const Presale = await ethers.getContractFactory("LILPEPE_Presale_Main");
  const presale = await Presale.deploy(
    oracle,
    usdt,
    usdc,
    saleToken,
    minTokenToBuy
  );

  await presale.waitForDeployment();
  const presaleAddress = await presale.getAddress();

  console.log(`✅ LILPEPE_Presale deployed at: ${presaleAddress}`);

  // ==== Call some view functions ====
  const presaleId = await presale.presaleId();
  console.log("Presale ID:", presaleId.toString());

  const minBuy = await presale.MinTokenTobuy();
  console.log("Minimum tokens to buy:", minBuy.toString());

  const currentSale = await presale.currentSale();
  console.log("Current Sale ID:", currentSale.toString());

  const fundReceiver = await presale.fundReceiver();
  console.log("Fund receiver:", fundReceiver);

  // Example: if oracle is valid, get price
  try {
    const price = await presale.getLatestPrice();
    console.log("Oracle price:", price.toString());
  } catch (err) {
    console.log("⚠️ getLatestPrice failed - check oracle address");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
