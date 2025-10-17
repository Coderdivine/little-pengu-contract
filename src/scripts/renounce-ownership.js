const { ethers } = require("hardhat");
const chalk = require("chalk");
const ora = require("ora");
const readline = require("readline");

async function main() {
  console.log(chalk.redBright.bold("\n⚠️  RENOUNCE OWNERSHIP\n"));

  const [owner] = await ethers.getSigners();
  console.log(chalk.cyan(`Current Owner: ${owner.address}\n`));

  const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS";

  const Contract = await ethers.getContractFactory("LILPENGU_Presale_Main");
  const presale = Contract.attach(CONTRACT_ADDRESS);

  const spinner = ora("Verifying ownership...").start();
  const contractOwner = await presale.owner();
  spinner.succeed(chalk.green("Ownership verified"));

  if (contractOwner.toLowerCase() !== owner.address.toLowerCase()) {
    console.log(chalk.red("\n❌ You are not the owner of this contract!\n"));
    console.log(chalk.yellow(`Contract Owner: ${contractOwner}`));
    console.log(chalk.yellow(`Your Address: ${owner.address}\n`));
    process.exit(1);
  }

  console.log(chalk.yellow("\n⚠️  WARNING: This action is IRREVERSIBLE!\n"));
  console.log(chalk.red("Renouncing ownership means:"));
  console.log(
    chalk.gray("  • You will permanently lose control of the contract")
  );
  console.log(
    chalk.gray("  • No one will be able to call owner-only functions")
  );
  console.log(chalk.gray("  • You cannot change presale settings"));
  console.log(chalk.gray("  • You cannot withdraw funds"));
  console.log(chalk.gray("  • You cannot pause/unpause the presale"));
  console.log(chalk.gray("  • This action CANNOT be undone\n"));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer1 = await new Promise((resolve) => {
    rl.question(
      chalk.yellow("Type 'YES' to confirm you understand: "),
      resolve
    );
  });

  if (answer1.trim() !== "YES") {
    console.log(
      chalk.green("\n✅ Operation cancelled. Ownership not renounced.\n")
    );
    rl.close();
    process.exit(0);
  }

  const answer2 = await new Promise((resolve) => {
    rl.question(chalk.yellow("\nType 'RENOUNCE' to proceed: "), resolve);
  });

  rl.close();

  if (answer2.trim() !== "RENOUNCE") {
    console.log(
      chalk.green("\n✅ Operation cancelled. Ownership not renounced.\n")
    );
    process.exit(0);
  }

  const renounceSpinner = ora("\nRenouncing ownership...").start();

  try {
    const tx = await presale.renounceOwnership();
    renounceSpinner.text = "Waiting for confirmation...";
    await tx.wait();

    renounceSpinner.succeed(chalk.green("Ownership renounced"));

    const newOwner = await presale.owner();
    console.log(chalk.cyan("\n📋 Verification:"));
    console.log(chalk.gray(`  New Owner: ${newOwner}`));

    if (newOwner === "0x0000000000000000000000000000000000000000") {
      console.log(
        chalk.greenBright.bold("\n✅ Ownership successfully renounced!")
      );
      console.log(chalk.yellow("The contract is now ownerless.\n"));
    } else {
      console.log(
        chalk.red("\n❌ Verification failed. Please check manually.\n")
      );
    }
  } catch (error) {
    renounceSpinner.fail(chalk.red("Failed to renounce ownership"));
    console.error(chalk.red(`\nError: ${error.message}\n`));
    process.exit(1);
  }
}

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(chalk.red(error));
//     process.exit(1);
//   });
