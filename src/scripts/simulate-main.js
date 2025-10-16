const { ethers } = require("hardhat");
const chalk = require("chalk");
const ora = require("ora");
const fs = require("fs");
const CONTRACT_NAME = "LILPENGU_Presale_Main";

async function main() {
  console.log(chalk.blueBright.bold("\n🔶 Asset Chain Main Simulation\n"));

  const [owner] = await ethers.getSigners();
  console.log(chalk.cyan(`Owner: ${owner.address}\n`));

  const MAIN_ADDRESS = "0x190aCD2491c053603432503b066F991dAe545ccc";
  const SALE_TOKEN_ADDRESS = "0xCeA9acb382125657776689f18e9d1c985eb9c3C7";

  const MainContract = await ethers.getContractFactory(CONTRACT_NAME);
  const main = MainContract.attach(MAIN_ADDRESS);

  // --- STEP 0: Load Exported Data ---
  const exportData = JSON.parse(fs.readFileSync("./export-data.json"));
  console.log(chalk.cyan("📥 Loaded export data:"));
  console.log(chalk.gray(`  User: ${exportData.user}`));
  console.log(
    chalk.gray(`  Invested: $${ethers.formatUnits(exportData.invested, 18)}`)
  );
  console.log(
    chalk.gray(
      `  Claimable: ${ethers.formatUnits(exportData.claimable, 18)} tokens\n`
    )
  );

  // --- STEP 1: Create Vesting Schedule ---
  console.log(chalk.yellow("Step 1: Setting up vesting\n"));
  const currentTime = Math.floor(Date.now() / 1000);
  const vestingStartTime = currentTime + 60;

  // let spinner = ora("Creating vesting schedule...").start();
  // try {
  //   const tx = await main.setPresaleVesting(
  //     [1],
  //     [vestingStartTime],
  //     [200],
  //     [300],
  //     [200]
  //   );
  //   await tx.wait();
  //   spinner.succeed(chalk.green("Vesting created: 20% initial, 20% every 5 mins"));
  // } catch (err) {
  //   spinner.fail(chalk.red(`Failed to create vesting: ${err.message}`));
  //   process.exit(1);
  // }

  // --- STEP 2: Register Blockchain ---
  // console.log(chalk.yellow("\nStep 2: Registering BNB blockchain\n"));
  // spinner = ora("Registering BNB...").start();
  // try {
  //   const tx = await main.registerBlockchain("BNB", 1, true);
  //   await tx.wait();
  //   spinner.succeed(chalk.green("BNB registered with vesting ID 1"));
  // } catch (err) {
    // spinner.fail(chalk.red(`Blockchain registration failed: ${err.message}`));
    // process.exit(1);
  // }

  // --- STEP 3: Import Cross-Chain Data ---
  console.log(chalk.yellow("\nStep 3: Importing cross-chain data\n"));
  spinner = ora("Importing data...").start();
  try {
    const tx = await main.importCrossChainData(
      "BNB",
      [exportData.user],
      [exportData.invested],
      [exportData.claimable]
    );
    await tx.wait();
    spinner.succeed(chalk.green("Data imported successfully"));
  } catch (err) {
    spinner.fail(chalk.red(`Import failed: ${err.message}`));
    process.exit(1);
  }

  // --- STEP 4: Display Blockchain Info ---
  const bcInfo = await main.getBlockchainInfo("BNB");
  console.log(chalk.cyan("\n📊 Blockchain Info:"));
  console.log(chalk.gray(`  Total Users: ${bcInfo.totalUsers}`));
  console.log(
    chalk.gray(`  Total Amount: ${ethers.formatEther(bcInfo.totalAmount)} tokens`)
  );
  console.log(chalk.gray(`  Enabled: ${bcInfo.isEnabled}`));

  // --- STEP 5: Verify Imported User Data ---
  console.log(chalk.yellow("\nStep 5: Verifying user data\n"));
  const userData = await main.getUserCrossChainData(owner.address, "BNB");
  console.log(chalk.cyan("User Data:"));
  console.log(
    chalk.gray(
      `  Total Claimable: ${ethers.formatEther(userData.totalClaimable)}`
    )
  );
  console.log(chalk.gray(`  Claimed: ${ethers.formatEther(userData.claimed)}`));
  console.log(chalk.gray(`  Remaining: ${ethers.formatEther(userData.remaining)}`));

  // --- STEP 6: Set Sale Token ---
  // console.log(chalk.yellow("\nStep 6: Setting sale token\n"));
  // try {
  //   const tx = await main.ChangeTokenToSell(SALE_TOKEN_ADDRESS);
  //   await tx.wait();
  //   console.log(chalk.green("✓ Sale token set"));
  // } catch (err) {
  //   console.log(chalk.red(`Failed to set sale token: ${err.message}`));
  //   process.exit(1);
  // }

  // --- STEP 7: Wait Until Vesting Starts ---
  const waitTime = vestingStartTime - Math.floor(Date.now() / 1000) + 5;
  if (waitTime > 0) {
    spinner = ora(`Waiting ${waitTime}s for vesting to start...`).start();
    await new Promise((resolve) => setTimeout(resolve, waitTime * 1000));
    spinner.succeed(chalk.green("Vesting started!"));
  }

  // --- STEP 8: Claim Tokens ---
  console.log(chalk.yellow("\nStep 7: Claiming tokens\n"));
  const claimableBefore = await main.getCrossChainClaimableAmount(owner.address, "BNB");
  console.log(
    chalk.cyan(`Claimable now: ${ethers.formatEther(claimableBefore)} tokens`)
  );

  try {
    // Before claiming, the contract needs tokens
    const saleToken = await ethers.getContractAt("StandardERC20", SALE_TOKEN_ADDRESS);
    await saleToken.transfer(MAIN_ADDRESS, ethers.parseEther("1000000"));
  } catch (error) {
    console.log({ error });
  }

  spinner = ora("Claiming from BNB...").start();
  try {
    const tx = await main.claimCrossChain("BNB");
    await tx.wait();
    spinner.succeed(chalk.green("Claim successful"));
  } catch (err) {
    spinner.fail(chalk.red(`Claim failed: ${err.message}`));
    process.exit(1);
  }

  // --- STEP 9: Verify Post-Claim Data ---
  const userDataAfter = await main.getUserCrossChainData(owner.address, "BNB");
  console.log(chalk.cyan("\n📊 After Claim:"));
  console.log(chalk.gray(`  Claimed: ${ethers.formatEther(userDataAfter.claimed)}`));
  console.log(chalk.gray(`  Remaining: ${ethers.formatEther(userDataAfter.remaining)}`));
  console.log(chalk.gray(`  Claim Count: ${userDataAfter.claimCount}`));

  console.log(chalk.greenBright.bold("\n✅ Main Chain Simulation Complete!\n"));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(chalk.red(error));
    process.exit(1);
  });
