// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MemoryGame {
    mapping(address => uint256) public deposits;
    
    event Deposited(address indexed player, uint256 amount);
    event Withdrawn(address indexed player, uint256 amount);
    
    // Deposit funds (used when starting a game)
    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        deposits[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }
    
    // Withdraw winnings
    function withdraw(uint256 amount) external {
        require(amount > 0, "Withdrawal amount must be greater than 0");
        require(deposits[msg.sender] >= amount, "Insufficient balance");
        
        deposits[msg.sender] -= amount;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Withdrawn(msg.sender, amount);
    }
    
    // Get player balance
    function getBalance(address player) external view returns (uint256) {
        return deposits[player];
    }
    
    // Allow contract to receive funds
    receive() external payable {
        deposits[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }
}
