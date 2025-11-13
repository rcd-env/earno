const hre = require("hardhat");

// ⚠️ UPDATE THIS AFTER DEPLOYING THE CONTRACT
const CONTRACT_ADDRESS = "YOUR_MAINNET_CONTRACT_ADDRESS_HERE";
const FUND_AMOUNT = "10"; // Amount in CELO to fund the prize pool

async function main() {
  if (CONTRACT_ADDRESS === "YOUR_MAINNET_CONTRACT_ADDRESS_HERE") {
    console.error("❌ Please update CONTRACT_ADDRESS in this script first!");
    console.error(
      "   Run deploy-mainnet.js first to get the contract address."
    );
    process.exit(1);
  }

  console.log("💰 Funding MemoryGame Prize Pool on Mainnet...");
  console.log("⚠️  WARNING: This will send REAL CELO!\n");

  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);

  console.log("Your address:", deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "CELO");
  console.log("Funding amount:", FUND_AMOUNT, "CELO\n");

  if (parseFloat(hre.ethers.formatEther(balance)) < parseFloat(FUND_AMOUNT)) {
    console.error("❌ Insufficient balance!");
    console.error(`   Need at least ${FUND_AMOUNT} CELO`);
    process.exit(1);
  }

  const MemoryGame = await hre.ethers.getContractAt(
    "MemoryGame",
    CONTRACT_ADDRESS
  );

  console.log("📝 Sending transaction...");
  const tx = await MemoryGame.fundPrizePool({
    value: hre.ethers.parseEther(FUND_AMOUNT),
  });

  console.log("⏳ Waiting for confirmation...");
  await tx.wait();

  const contractBalance = await hre.ethers.provider.getBalance(
    CONTRACT_ADDRESS
  );

  console.log("\n✅ Prize pool funded successfully!");
  console.log(
    "Contract balance:",
    hre.ethers.formatEther(contractBalance),
    "CELO"
  );
  console.log("🔗 Transaction:", `https://celoscan.io/tx/${tx.hash}`);
  console.log("\n🎮 Your game is now live on Celo Mainnet!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
