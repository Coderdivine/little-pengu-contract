const { Wallet } = require("ethers");

function generatePrivateKeys(count = 1) {
  const keys = [];
  for (let i = 0; i < count; i++) {
    const wallet = Wallet.createRandom();
    keys.push({
      address: wallet.address,
      privateKey: wallet.privateKey,
    });
  }
  return keys;
}

const generated = generatePrivateKeys(1);
console.log("Generated Wallets:");
console.log(generated);
