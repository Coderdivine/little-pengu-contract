#!/usr/bin/env node
const hre = require("hardhat");
const { ethers } = hre;
const chalk = require("chalk");
const ora = require("ora");

async function main() {
  console.clear();
  console.log(chalk.cyan.bold("🚀 LILPEPE Presale Tester (Hardhat CLI)\n"));

  // Spinner start
  const spinner = ora("Connecting to deployed presale contract...").start();

  try {
    const presaleAddress = "0xC2014403Bb17BFFba9C6af561CfaA3F3957e69D3";
    const Presale = await ethers.getContractFactory("LILPENGU_Presale_Testnet_Source");
    const presale = Presale.attach(presaleAddress);

    spinner.succeed(chalk.green(`Connected to Presale Contract: ${presaleAddress}`));

    console.log(chalk.yellow("\n🔍 Fetching contract details...\n"));

    // Presale ID
    spinner.start("Fetching Presale ID...");
    const presaleId = await presale.presaleId();
    spinner.succeed(chalk.green("Presale ID: ") + chalk.white(presaleId.toString()));

    // Minimum buy
    spinner.start("Fetching Minimum tokens to buy...");
    const minBuy = await presale.MinTokenTobuy();
    spinner.succeed(chalk.green("Minimum tokens to buy: ") + chalk.white(minBuy.toString()));

    // Current sale
    spinner.start("Fetching Current Sale ID...");
    const currentSale = await presale.currentSale();
    spinner.succeed(chalk.green("Current Sale ID: ") + chalk.white(currentSale.toString()));

    // Fund receiver
    spinner.start("Fetching Fund Receiver address...");
    const fundReceiver = await presale.fundReceiver();
    spinner.succeed(chalk.green("Fund Receiver: ") + chalk.white(fundReceiver));

    // Oracle price
    spinner.start("Fetching latest oracle price...");
    try {
      const price = await presale.getLatestPrice();
      spinner.succeed(chalk.green("Oracle Price: ") + chalk.white(price.toString()));
    } catch (err) {
      spinner.fail(chalk.red("⚠️ Failed to fetch oracle price — check oracle address or network."));
    }

    console.log(chalk.cyan.bold("\n✅ Presale contract test completed successfully!\n"));
  } catch (error) {
    spinner.fail(chalk.red("❌ Error encountered while testing contract."));
    console.error(chalk.redBright(error.message || error));
  } finally {
    console.log(chalk.gray("---------------------------------------------------"));
    console.log(chalk.magenta("🧩 Script Execution Complete"));
    process.exit(0);
  }
}

main();
