// ============================================
// scripts/transfer-ownership.js
// ============================================

const { ethers } = require("hardhat");
const chalk = require("chalk");
const ora = require("ora");
const readline = require("readline");

async function main() {
  console.log(chalk.blueBright.bold("\n🔄 Transfer Contract Ownership\n"));

  const [owner] = await ethers.getSigners();
  console.log(chalk.cyan(`Current Owner: ${owner.address}\n`));

  const CONTRACT_ADDRESS = "0x3AaA141D0Eb320D737A7AF3847Cc383fFd6ECef7";
  const NEW_OWNER = "0xF7e1c587d0E6D76Db3fAe238A4452c7Cb64D1526";

  const Contract = await ethers.getContractFactory("LILPENGU_Presale_Main");
  const presale = Contract.attach(CONTRACT_ADDRESS);

  const spinner = ora("Verifying current ownership...").start();
  const contractOwner = await presale.owner();
  spinner.succeed(chalk.green("Ownership verified"));

  if (contractOwner.toLowerCase() !== owner.address.toLowerCase()) {
    console.log(chalk.red("\n❌ You are not the owner of this contract!\n"));
    console.log(chalk.yellow(`Contract Owner: ${contractOwner}`));
    console.log(chalk.yellow(`Your Address: ${owner.address}\n`));
    process.exit(1);
  }

  if (NEW_OWNER === "0x0000000000000000000000000000000000000000") {
    console.log(chalk.red("\n❌ Cannot transfer to zero address!"));
    console.log(
      chalk.yellow(
        "Use renounce-ownership.js if you want to remove ownership.\n"
      )
    );
    process.exit(1);
  }

  if (contractOwner.toLowerCase() === NEW_OWNER.toLowerCase()) {
    console.log(
      chalk.yellow(
        "\n⚠️  New owner is the same as current owner. No change needed.\n"
      )
    );
    process.exit(0);
  }


  console.log(chalk.yellow("\n📋 Transfer Details:"));
  console.log(chalk.gray(`  Current Owner: ${contractOwner}`));
  console.log(chalk.gray(`  New Owner: ${NEW_OWNER}\n`));

  console.log(chalk.yellow("⚠️  Important Notes:"));
  console.log(
    chalk.gray("  • The new owner will have full control of the contract")
  );
  console.log(chalk.gray("  • You will lose all owner privileges"));
  console.log(chalk.gray("  • Make sure the new address is correct"));
  console.log(
    chalk.gray("  • Consider using a multisig wallet for security\n")
  );

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await new Promise((resolve) => {
    rl.question(chalk.yellow("Type 'TRANSFER' to confirm: "), resolve);
  });

  rl.close();

  if (answer.trim() !== "TRANSFER") {
    console.log(
      chalk.green("\n✅ Operation cancelled. Ownership not transferred.\n")
    );
    process.exit(0);
  }

  const transferSpinner = ora("\nTransferring ownership...").start();

  try {
    const tx = await presale.transferOwnership(NEW_OWNER);
    transferSpinner.text = "Waiting for confirmation...";
    await tx.wait();

    transferSpinner.succeed(chalk.green("Ownership transferred"));

    const newOwner = await presale.owner();
    console.log(chalk.cyan("\n📋 Verification:"));
    console.log(chalk.gray(`  Previous Owner: ${contractOwner}`));
    console.log(chalk.gray(`  New Owner: ${newOwner}`));

    if (newOwner.toLowerCase() === NEW_OWNER.toLowerCase()) {
      console.log(
        chalk.greenBright.bold("\n✅ Ownership successfully transferred!\n")
      );
    } else {
      console.log(
        chalk.red("\n❌ Verification failed. Please check manually.\n")
      );
    }
  } catch (error) {
    transferSpinner.fail(chalk.red("Failed to transfer ownership"));
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
