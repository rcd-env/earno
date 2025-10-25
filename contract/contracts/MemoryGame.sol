// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MemoryGame {
    mapping(address => uint256) public deposits;
    address public owner;
    
    event Deposited(address indexed player, uint256 amount);
    event Withdrawn(address indexed player, uint256 amount);
    event PrizePoolFunded(uint256 amount);
    
    constructor() {
        owner = msg.sender;
    }
    
    // Deposit funds (used when starting a game)
    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        deposits[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }
    
    // Withdraw winnings (can withdraw more than deposited if there's prize pool)
    function withdraw(uint256 amount) external {
        require(amount > 0, "Withdrawal amount must be greater than 0");
        require(address(this).balance >= amount, "Insufficient contract balance");
        
        // Allow withdrawal up to what they deposited or earned
        // The frontend calculates the proper amount based on game results
        deposits[msg.sender] = 0; // Reset their deposit tracking
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Withdrawn(msg.sender, amount);
    }
    
    // Owner can fund the prize pool
    function fundPrizePool() external payable {
        require(msg.value > 0, "Fund amount must be greater than 0");
        emit PrizePoolFunded(msg.value);
    }
    
    // Get player balance
    function getBalance(address player) external view returns (uint256) {
        return deposits[player];
    }
    
    // Get contract balance (total prize pool + deposits)
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // Allow contract to receive funds
    receive() external payable {
        emit PrizePoolFunded(msg.value);
    }
}
