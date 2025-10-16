const hre = require("hardhat");
const { ethers, network } = hre;
const chalk = require("chalk");
const ora = require("ora");
const { CONFIG } = require("../configs");
const CONTRACT_NAME = "LILPENGU_Presale_Source";

async function main() {
  const net = network.name;
  console.log(chalk.blueBright.bold(`\n🌍 Deploying to network:`), chalk.yellow(net));

  const config = CONFIG[net];
  if (!config) {
    console.log(chalk.redBright(`\n❌ No configuration found for network: ${net}\n`));
    process.exit(1);
  }

  console.log(chalk.cyan(`\n🔧 Using configuration:`));
  console.table(config);

  const spinner = ora(chalk.green(`Deploying LILPENGU Presale Source...`)).start();

  try {
    const Presale = await ethers.getContractFactory(CONTRACT_NAME);
    const presale = await Presale.deploy(
      config.oracle,
      config.usdt,
      config.usdc,
      config.saleToken,
      config.minTokenToBuy
    );

    spinner.text = chalk.yellow("⏳ Waiting for deployment confirmation...");
    await presale.waitForDeployment();

    const presaleAddress = await presale.getAddress();

    spinner.succeed(chalk.greenBright("✅ Deployment successful!"));
    console.log(chalk.bold(`\n🎯 Contract deployed at:`), chalk.greenBright(presaleAddress));
    console.log(chalk.magentaBright(`\n🔗 Network:`), chalk.cyanBright(net), "\n");
  } catch (error) {
    spinner.fail(chalk.redBright("❌ Deployment failed!"));
    console.error(chalk.red(error.message || error));
    process.exit(1);
  }
}

main();

// module.exports = [
//   "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
//   "0xdAC17F958D2ee523a2206206994597C13D831ec7",
//   "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
//   "0xB5F20B4AEbeA14424E0b5A031745ED4DD3eE4f9e",
//   1
// ];
