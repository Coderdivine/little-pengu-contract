const hre = require("hardhat");
const { ethers, network } = hre;
const chalk = require("chalk");
const ora = require("ora");
const { EXPLORERS } = require("../configs");



async function checkNonce() {
  const net = network.name;
  const spinner = ora(chalk.cyan(`Checking nonce on ${net} network...`)).start();

  try {
    const [deployer] = await ethers.getSigners();
    const explorer = EXPLORERS[net] || "https://";

    spinner.text = chalk.yellow("Sending dummy transaction...");
    const tx = await deployer.sendTransaction({
      to: deployer.address,
      value: 0, // gas-only tx
    });
    await tx.wait();

    spinner.succeed(chalk.greenBright("Dummy transaction confirmed!"));
    console.log(
      chalk.blueBright("\n🔗 Transaction:"),
      chalk.underline(`${explorer}${tx.hash}`)
    );

    spinner.start(chalk.cyan("Fetching updated nonce..."));
    const nonce = await ethers.provider.getTransactionCount(deployer.address);

    spinner.succeed(chalk.greenBright("Nonce check complete!"));
    console.log(chalk.bold("\n👤 Deployer:"), chalk.yellow(deployer.address));
    console.log(chalk.bold("🔢 Current Nonce:"), chalk.green(nonce), "\n");
  } catch (err) {
    spinner.fail(chalk.redBright("❌ Failed to check nonce"));
    console.error(chalk.red(err.message || err));
    process.exit(1);
  }
}

checkNonce();
