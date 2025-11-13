const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying MemoryGame to Celo Mainnet...");
  console.log("⚠️  WARNING: This will use REAL CELO!\n");

  const [deployer] = await hre.ethers.getSigners();

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer address:", deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "CELO\n");

  if (parseFloat(hre.ethers.formatEther(balance)) < 0.5) {
    console.error(
      "❌ Insufficient balance! Need at least 0.5 CELO for deployment"
    );
    console.error("   Please add CELO to:", deployer.address);
    process.exit(1);
  }

  // Deploy contract
  console.log("📝 Deploying MemoryGame contract...");
  const MemoryGame = await hre.ethers.getContractFactory("MemoryGame");
  const memoryGame = await MemoryGame.deploy();

  await memoryGame.waitForDeployment();
  const address = await memoryGame.getAddress();

  console.log("\n✅ MemoryGame deployed successfully!");
  console.log("📍 Contract Address:", address);
  console.log("🔗 View on CeloScan:", `https://celoscan.io/address/${address}`);
  console.log("\n📋 IMPORTANT - Save this address!");
  console.log("   Update client/src/lib/contract.ts with:");
  console.log(`   MEMORY_GAME_ADDRESS = "${address}"\n`);

  console.log("📋 Next Steps:");
  console.log("1. Update MEMORY_GAME_ADDRESS in client/src/lib/contract.ts");
  console.log("2. Fund the prize pool: node scripts/fund-mainnet.js");
  console.log("3. Build and deploy client: cd client && npm run build");
  console.log("4. Deploy to Vercel: vercel --prod");
  console.log("\n⚠️  Remember to keep your private key secure!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
