const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("JagerHunterModule", (m) => {
  const jagerHunter = m.contract("JagerHunter");

  return { jagerHunter };
});
