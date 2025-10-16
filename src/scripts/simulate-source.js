const { ethers } = require("hardhat");
const chalk = require("chalk");
const ora = require("ora");
const fs = require("fs");
const CONTRACT_NAME = "LILPENGU_Presale_Source";

async function main() {
  console.log(chalk.blueBright.bold("\n🔷 BNB Source Chain Simulation\n"));

  const [owner] = await ethers.getSigners();
  console.log(chalk.cyan(`Owner: ${owner.address}\n`));

  const SOURCE_ADDRESS = "0xde576626C75Eda1fE93a091026870D5958cf40D2";
  const USDT_ADDRESS = "0xa8fD6920B23f0a625914c8f12361E89930BeeD59";

  const SourceContract = await ethers.getContractFactory(CONTRACT_NAME);
  const source = SourceContract.attach(SOURCE_ADDRESS);

  const usdt = await ethers.getContractAt("MyStableCoin", USDT_ADDRESS);

  // console.log(chalk.yellow("Step 1: Creating 10 presale stages\n"));
  // for (let i = 1; i <= 10; i++) {
  //   const spinner = ora(`Creating stage ${i}...`).start();
  //   const tx = await source.createPresale(
  //     ethers.parseEther("1"),
  //     ethers.parseEther("1.1"),
  //     ethers.parseEther("100000"),
  //     ethers.parseEther("100000")
  //   );
  //   await tx.wait();
  //   spinner.succeed(chalk.green(`Stage ${i} created`));
  // }

  console.log(chalk.yellow("\nStep 2: Buying from all 10 stages\n"));
  const purchaseAmount = ethers.parseUnits("1", 6);

  const spinnerApprove = ora("Approving USDT max allowance...").start();
  // try {
  //   const approveTx = await usdt.approve(SOURCE_ADDRESS, ethers.MaxUint256);
  //   await approveTx.wait();
  //   spinnerApprove.succeed(chalk.green("USDT max allowance approved ✅"));
  // } catch (err) {
  //   spinnerApprove.fail(chalk.red(`Approval failed — ${err.message}`));
  //   process.exit(1);
  // }

  // for (let stageId = 1; stageId <= 10; stageId++) {
  //   const spinner = ora(
  //     `Stage ${stageId}: Setting active and purchasing...`
  //   ).start();

  //   await source.setPresaleStage(stageId);
  //   await source.buyWithUSDT(purchaseAmount);

  //   spinner.succeed(chalk.green(`Stage ${stageId}: Purchased 1 token for $1`));
  // }

  console.log(chalk.yellow("\nStep 3: Exporting data\n"));
  const spinner = ora("Fetching export data...").start();

  const userResults = await source.getAllParticipants();
  const users = [...userResults];
  const exportData = await source.getExportData([owner.address, owner.address])

  console.log("Export Data:", exportData);

  // Safely access first user's data
  const userData = exportData?.[0];


  spinner.succeed(chalk.green("Export complete"));

  console.log(chalk.cyan("\n📊 Export Data:"));
  console.log(chalk.gray(`  User: ${userData.user}`));
  console.log(
    chalk.gray(
      `  Total Invested: $${ethers.formatEther(userData.totalInvestedAmount)}`
    )
  );
  console.log(
    chalk.gray(
      `  Total Claimable: ${ethers.formatEther(
        userData.totalClaimableAmount
      )} tokens`
    )
  );

  const exportResult = {
    user: userData.user,
    invested: userData.totalInvestedAmount.toString(),
    claimable: userData.totalClaimableAmount.toString(),
  };

  fs.writeFileSync("./export-data.json", JSON.stringify(exportResult, null, 2));
  console.log(chalk.green("\n✅ Data saved to export-data.json\n"));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(chalk.red(error));
    process.exit(1);
  });
