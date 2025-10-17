const { ethers, network } = require("hardhat");
const chalk = require("chalk");
const ora = require("ora");

async function main() {
  console.log(chalk.blueBright.bold("\n🎯 Creating 19 Presale Stages\n"));

  const [owner] = await ethers.getSigners();
  const net = network.name;
  
  console.log(chalk.cyan(`Network: ${net}`));
  console.log(chalk.cyan(`Owner: ${owner.address}\n`));

  const CONTRACT_ADDRESS = "0x3AaA141D0Eb320D737A7AF3847Cc383fFd6ECef7";

  const Contract = await ethers.getContractFactory("LILPENGU_Presale_Source");
  const presale = Contract.attach(CONTRACT_ADDRESS);

  const network_ = net?.trim();
  const isBnbOrAsset = network_ === "bnbTestnet" || network_ === "bsc" || network_ === "assetchainTestnet" || network_ === "assetchain";
  const hardcapDecimals = isBnbOrAsset ? 18 : 6;

  console.log(chalk.yellow(`Using ${hardcapDecimals} decimals for hardcap\n`));

  const stages = [
    { tokens: "200000000", pricePerUSDT: "1000.00", hardcap: "200000", nextPrice: "909.09" },
    { tokens: "500000000", pricePerUSDT: "909.09", hardcap: "550000", nextPrice: "833.33" },
    { tokens: "800000000", pricePerUSDT: "833.33", hardcap: "960000", nextPrice: "769.23" },
    { tokens: "1500000000", pricePerUSDT: "769.23", hardcap: "1950000", nextPrice: "714.29" },
    { tokens: "1500000000", pricePerUSDT: "714.29", hardcap: "2100000", nextPrice: "666.67" },
    { tokens: "1500000000", pricePerUSDT: "666.67", hardcap: "2250000", nextPrice: "625.00" },
    { tokens: "1500000000", pricePerUSDT: "625.00", hardcap: "2400000", nextPrice: "588.24" },
    { tokens: "1500000000", pricePerUSDT: "588.24", hardcap: "2550000", nextPrice: "555.56" },
    { tokens: "1500000000", pricePerUSDT: "555.56", hardcap: "2700000", nextPrice: "526.32" },
    { tokens: "1500000000", pricePerUSDT: "526.32", hardcap: "2850000", nextPrice: "500.00" },
    { tokens: "1500000000", pricePerUSDT: "500.00", hardcap: "3000000", nextPrice: "476.19" },
    { tokens: "1500000000", pricePerUSDT: "476.19", hardcap: "3150000", nextPrice: "454.55" },
    { tokens: "1500000000", pricePerUSDT: "454.55", hardcap: "3300000", nextPrice: "434.78" },
    { tokens: "1500000000", pricePerUSDT: "434.78", hardcap: "3450000", nextPrice: "416.67" },
    { tokens: "1500000000", pricePerUSDT: "416.67", hardcap: "3600000", nextPrice: "400.00" },
    { tokens: "1500000000", pricePerUSDT: "400.00", hardcap: "3750000", nextPrice: "384.62" },
    { tokens: "1500000000", pricePerUSDT: "384.62", hardcap: "3900000", nextPrice: "370.37" },
    { tokens: "1500000000", pricePerUSDT: "370.37", hardcap: "4050000", nextPrice: "357.14" },
    { tokens: "1500000000", pricePerUSDT: "357.14", hardcap: "4200000", nextPrice: "344.83" },
    // { tokens: "1500000000", pricePerUSDT: "344.83", hardcap: "4350000", nextPrice: "344.83" }
  ];

  console.log(chalk.yellow("Creating presale stages...\n"));

  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    const stageNum = i + 1;

    const spinner = ora(`Checking Stage ${stageNum}...`).start();

    try {
      const existingStage = await presale.presale(stageNum);
      
      if (existingStage.tokensToSell > 0) {
        spinner.info(chalk.yellow(`Stage ${stageNum} already exists, skipping...`));
        continue;
      }

      spinner.text = `Creating Stage ${stageNum}...`;

      const tokensToSell = ethers.parseEther(stage.tokens);
      const price = ethers.parseEther(stage.pricePerUSDT);
      const nextStagePrice = ethers.parseEther(stage.nextPrice);
      const hardcap = ethers.parseUnits(stage.hardcap, hardcapDecimals);

      const tx = await presale.createPresale(
        price,
        nextStagePrice,
        tokensToSell,
        hardcap
      );

      await tx.wait();

      spinner.succeed(
        chalk.green(
          `Stage ${stageNum}: ${stage.tokens} tokens at ${stage.pricePerUSDT} per USDT | Hardcap: ${stage.hardcap}`
        )
      );

      if (stageNum === 1) {
        const activateSpinner = ora("Activating Stage 1...").start();
        const activateTx = await presale.setPresaleStage(1);
        await activateTx.wait();
        activateSpinner.succeed(chalk.green("Stage 1 activated"));
      }
    } catch (error) {
      spinner.fail(chalk.red(`Stage ${stageNum} failed: ${error.message}`));
      process.exit(1);
    }
  }

  console.log(chalk.greenBright.bold("\n✅ All 20 Presale Stages Created Successfully!\n"));

  console.log(chalk.cyan("Summary:"));
  console.log(chalk.gray(`  Total Stages: 20`));
  console.log(chalk.gray(`  Total Tokens: 27,000,000,000`));
  console.log(chalk.gray(`  Total Hardcap: $47,150,000`));
  console.log(chalk.gray(`  Hardcap Decimals: ${hardcapDecimals}\n`));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(chalk.red(error));
    process.exit(1);
  });