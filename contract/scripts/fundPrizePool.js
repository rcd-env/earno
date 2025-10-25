const hre = require("hardhat");
const { parseEther } = require("ethers");

async function main() {
  const contractAddress = "0x8E22e7b63FBF78a9d5CA69262Fb0E53e2FD5Dc8f";
  // Get amount from environment variable or use default
  const fundAmount = process.env.FUND_AMOUNT || "10"; // Default 10 CELO

  console.log(`Funding prize pool with ${fundAmount} CELO...`);

  const [deployer] = await hre.ethers.getSigners();
  console.log(`Funding from account: ${deployer.address}`);

  // Get the contract
  const MemoryGame = await hre.ethers.getContractAt(
    "MemoryGame",
    contractAddress
  );

  // Fund the prize pool
  const tx = await MemoryGame.fundPrizePool({
    value: parseEther(fundAmount),
  });

  await tx.wait();

  console.log(`✅ Prize pool funded with ${fundAmount} CELO`);
  console.log(`Transaction hash: ${tx.hash}`);

  // Check contract balance
  const balance = await MemoryGame.getContractBalance();
  console.log(
    `📊 Current contract balance: ${hre.ethers.formatEther(balance)} CELO`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
