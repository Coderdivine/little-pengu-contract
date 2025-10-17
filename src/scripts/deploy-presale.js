const hre = require("hardhat");
const { ethers, network } = hre;
const chalk = require("chalk");
const ora = require("ora");
const { CONFIG } = require("../configs");
const CONTRACT_NAME = "LILPENGU_Presale_Main";

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

// main();

const net = network.name;
const config = CONFIG[net];

module.exports = [
  config.oracle,
  config.usdt,
  config.usdc,
  config.saleToken,
  config.minTokenToBuy
];
