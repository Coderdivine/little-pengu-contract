const { ethers } = require("hardhat");
const chalk = require("chalk");
const ora = require("ora");

async function main() {
  console.log(chalk.blueBright.bold("\n💰 Change Fund Receiver Wallet\n"));

  const [owner] = await ethers.getSigners();
  console.log(chalk.cyan(`Owner: ${owner.address}\n`));

  const CONTRACT_ADDRESS = "0x3AaA141D0Eb320D737A7AF3847Cc383fFd6ECef7";
  const NEW_FUND_WALLET = "0xFc56Fa3FF1641f4311A3c736233881EeB1028332";

  const Contract = await ethers.getContractFactory("LILPENGU_Presale_Main");
  const presale = Contract.attach(CONTRACT_ADDRESS);

  const spinner = ora("Getting current fund receiver...").start();
  const currentFundReceiver = await presale.fundReceiver();
  spinner.succeed(chalk.green("Current fund receiver retrieved"));

  console.log(chalk.yellow("\n📋 Current Settings:"));
  console.log(chalk.gray(`  Current Fund Receiver: ${currentFundReceiver}`));
  console.log(chalk.gray(`  New Fund Receiver: ${NEW_FUND_WALLET}\n`));

  if (currentFundReceiver.toLowerCase() === NEW_FUND_WALLET.toLowerCase()) {
    console.log(
      chalk.yellow(
        "⚠️  New address is the same as current address. No change needed.\n"
      )
    );
    return;
  }

  const confirmSpinner = ora("Changing fund receiver wallet...").start();

  try {
    const tx = await presale.changeFundWallet(NEW_FUND_WALLET);
    confirmSpinner.text = "Waiting for confirmation...";
    await tx.wait();

    confirmSpinner.succeed(chalk.green("Fund receiver changed successfully!"));

    const newFundReceiver = await presale.fundReceiver();
    console.log(chalk.cyan("\n✅ Verification:"));
    console.log(chalk.gray(`  New Fund Receiver: ${newFundReceiver}\n`));

    if (newFundReceiver.toLowerCase() === NEW_FUND_WALLET.toLowerCase()) {
      console.log(
        chalk.greenBright.bold("✅ Fund wallet updated successfully!\n")
      );
    } else {
      console.log(
        chalk.red("❌ Verification failed. Please check manually.\n")
      );
    }
  } catch (error) {
    confirmSpinner.fail(chalk.red("Failed to change fund wallet"));
    console.error(chalk.red(`\nError: ${error.message}\n`));
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(chalk.red(error));
    process.exit(1);
  });
