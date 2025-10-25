const hre = require("hardhat");

async function main() {
  console.log("Deploying MemoryGame contract to Celo Alfajores...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const MemoryGame = await hre.ethers.getContractFactory("MemoryGame");
  const memoryGame = await MemoryGame.deploy();

  await memoryGame.waitForDeployment();

  const address = await memoryGame.getAddress();

  console.log("\n✅ MemoryGame deployed to:", address);
  console.log("\nUpdate this address in client/src/lib/contract.ts");
  console.log(`export const MEMORY_GAME_ADDRESS = "${address}";`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
