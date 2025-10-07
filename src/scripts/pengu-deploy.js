const hre = require("hardhat");
const { ethers, network } = hre;
const chalk = require("chalk");
const ora = require("ora");
const { EXPLORERS } = require("../configs");

async function main() {
  const net = network.name;
  console.log(chalk.blueBright.bold(`\n🌍 Deploying to network:`), chalk.yellow(net));

  const spinner = ora(chalk.cyan("Preparing deployment...")).start();

  try {
    const [deployer] = await ethers.getSigners();
    spinner.text = chalk.yellow("Compiling & fetching contract factory...");

    const PenguFactory = await ethers.getContractFactory("LILPENGU");

    spinner.text = chalk.cyan("Deploying LITTLE PENGU contract...");
    const pengu = await PenguFactory.deploy();
    await pengu.waitForDeployment();

    const contractAddress = await pengu.getAddress();
    const explorer = EXPLORERS[net] || "https://";

    spinner.succeed(chalk.greenBright("✅ Deployment successful!"));
    console.log(chalk.bold("\n👤 Deployer:"), chalk.yellow(deployer.address));
    console.log(chalk.bold("🎯 Contract deployed at:"), chalk.greenBright(contractAddress));
    console.log(chalk.bold("🔗 Explorer:"), chalk.underline(`${explorer}${contractAddress}\n`));
  } catch (error) {
    spinner.fail(chalk.redBright("❌ Deployment failed!"));
    console.error(chalk.red(error.message || error));
    process.exit(1);
  }
}

main();

module.exports = [];
