// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MemoryGame {
    struct GameState {
        uint256 gridSize;
        uint256 betAmount;
        uint256 matchesFound;
        uint256 totalPairs;
        bool isActive;
        uint256 startTime;
    }

    mapping(address => GameState) public games;
    mapping(address => uint256) public totalWinnings;
    
    event GameStarted(address indexed player, uint256 gridSize, uint256 betAmount);
    event MatchRecorded(address indexed player, bool correct, uint256 matchesFound);
    event GameEnded(address indexed player, uint256 payout, bool won);
    
    // Start a new game
    function startGame(uint256 gridSize) external payable {
        require(gridSize >= 2 && gridSize <= 8, "Grid size must be between 2 and 8");
        require(msg.value > 0, "Bet amount must be greater than 0");
        require(!games[msg.sender].isActive, "Game already in progress");
        
        uint256 totalPairs = (gridSize * gridSize) / 2;
        
        games[msg.sender] = GameState({
            gridSize: gridSize,
            betAmount: msg.value,
            matchesFound: 0,
            totalPairs: totalPairs,
            isActive: true,
            startTime: block.timestamp
        });
        
        emit GameStarted(msg.sender, gridSize, msg.value);
    }
    
    // Record a match (called by player)
    function recordMatch(bool correct) external {
        require(games[msg.sender].isActive, "No active game");
        
        if (correct) {
            games[msg.sender].matchesFound++;
        }
        
        emit MatchRecorded(msg.sender, correct, games[msg.sender].matchesFound);
    }
    
    // End the game and calculate payout
    function endGame() external {
        GameState storage game = games[msg.sender];
        require(game.isActive, "No active game");
        
        bool won = game.matchesFound == game.totalPairs;
        uint256 payout = 0;
        
        if (won) {
            payout = calculateReward(game.gridSize, game.betAmount);
            totalWinnings[msg.sender] += payout;
            
            // Transfer winnings to player
            (bool success, ) = payable(msg.sender).call{value: payout}("");
            require(success, "Transfer failed");
        }
        
        game.isActive = false;
        
        emit GameEnded(msg.sender, payout, won);
    }
    
    // Calculate reward based on grid size
    function calculateReward(uint256 gridSize, uint256 bet) public pure returns (uint256) {
        uint256 multiplier;
        
        if (gridSize == 2) {
            multiplier = 120; // 1.2x
        } else if (gridSize == 3) {
            multiplier = 150; // 1.5x
        } else if (gridSize == 4) {
            multiplier = 200; // 2x
        } else if (gridSize == 5) {
            multiplier = 250; // 2.5x
        } else if (gridSize == 6) {
            multiplier = 300; // 3x
        } else if (gridSize == 7) {
            multiplier = 350; // 3.5x
        } else if (gridSize == 8) {
            multiplier = 400; // 4x
        } else {
            multiplier = 100; // 1x fallback
        }
        
        return (bet * multiplier) / 100;
    }
    
    // Get current game state for a player
    function getGameState(address player) external view returns (
        uint256 gridSize,
        uint256 betAmount,
        uint256 matchesFound,
        uint256 totalPairs,
        bool isActive,
        uint256 startTime
    ) {
        GameState memory game = games[player];
        return (
            game.gridSize,
            game.betAmount,
            game.matchesFound,
            game.totalPairs,
            game.isActive,
            game.startTime
        );
    }
    
    // Get total winnings for a player
    function getTotalWinnings(address player) external view returns (uint256) {
        return totalWinnings[player];
    }
    
    // Allow contract to receive funds
    receive() external payable {}
}
