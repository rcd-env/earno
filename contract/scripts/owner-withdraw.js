const hre = require("hardhat");

// ⚠️ UPDATE THIS WITH YOUR DEPLOYED CONTRACT ADDRESS
const CONTRACT_ADDRESS = "0x153C0cb779Cf4955329989d23304736A9889eD0d";

// Set to "partial" or "all"
const WITHDRAW_TYPE = "all"; // or "partial"
const PARTIAL_AMOUNT = "5"; // Amount in CELO if WITHDRAW_TYPE is "partial"

async function main() {
  console.log("💰 Owner Withdrawal from MemoryGame Contract\n");

  const [owner] = await hre.ethers.getSigners();
  console.log("Owner address:", owner.address);

  // Connect to the contract
  const MemoryGame = await hre.ethers.getContractAt(
    "MemoryGame",
    CONTRACT_ADDRESS
  );

  // Check contract balance
  const contractBalance = await hre.ethers.provider.getBalance(
    CONTRACT_ADDRESS
  );
  console.log(
    "Contract balance:",
    hre.ethers.formatEther(contractBalance),
    "CELO"
  );

  // Check owner balance before
  const ownerBalanceBefore = await hre.ethers.provider.getBalance(
    owner.address
  );
  console.log(
    "Owner balance (before):",
    hre.ethers.formatEther(ownerBalanceBefore),
    "CELO\n"
  );

  if (parseFloat(hre.ethers.formatEther(contractBalance)) === 0) {
    console.log("❌ No funds to withdraw!");
    return;
  }

  // Perform withdrawal
  let tx;
  if (WITHDRAW_TYPE === "all") {
    console.log("📝 Withdrawing ALL funds...");
    tx = await MemoryGame.ownerWithdrawAll();
  } else {
    console.log(`📝 Withdrawing ${PARTIAL_AMOUNT} CELO...`);
    tx = await MemoryGame.ownerWithdraw(hre.ethers.parseEther(PARTIAL_AMOUNT));
  }

  console.log("⏳ Waiting for confirmation...");
  const receipt = await tx.wait();

  // Check balances after
  const contractBalanceAfter = await hre.ethers.provider.getBalance(
    CONTRACT_ADDRESS
  );
  const ownerBalanceAfter = await hre.ethers.provider.getBalance(owner.address);

  console.log("\n✅ Withdrawal successful!");
  console.log(
    "Contract balance (after):",
    hre.ethers.formatEther(contractBalanceAfter),
    "CELO"
  );
  console.log(
    "Owner balance (after):",
    hre.ethers.formatEther(ownerBalanceAfter),
    "CELO"
  );
  console.log("🔗 Transaction:", `https://celoscan.io/tx/${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
