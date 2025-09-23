const hre = require("hardhat");
const { ethers } = hre;


async function main() {
  const oracle = "0x9fd12A214AFC063158eFc1E96Ee07b93c385af2e";
  const usdt = "0xa8fD6920B23f0a625914c8f12361E89930BeeD59";
  const usdc = "0xa8fD6920B23f0a625914c8f12361E89930BeeD59";
  const saleToken = "0x48065f4c6A22a1075851f1879699bF19367ee459";
  const minTokenToBuy = 1;

  console.log("Deploying LILPEPE_Presale...");

  const Presale = await ethers.getContractFactory("LILPEPE_Presale_Source");
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
