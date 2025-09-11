const hre = require("hardhat");
const { ethers } = hre;

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    const JagerHunter = await ethers.getContractFactory("JagerHunter");

    const contract = await JagerHunter.deploy({
        gasLimit: 9_808_999,
    });

    await contract.waitForDeployment();
    console.log("JagerHunter deployed to:", contract.address);
}

main().catch((error) => {
    console.error("Deployment failed:", error);
    process.exitCode = 1;
});
