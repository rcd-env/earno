import { useState, useCallback, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import { MEMORY_GAME_ADDRESS, MEMORY_GAME_ABI } from "../lib/contract";

export type GameStatus =
  | "idle"
  | "starting"
  | "playing"
  | "completed"
  | "claiming";

export function useMemoryGame() {
  const { address } = useAccount();
  const [gridSize, setGridSize] = useState(4);
  const [betAmount, setBetAmount] = useState("");
  const [gameStatus, setGameStatus] = useState<GameStatus>("idle");
  const [matchesFound, setMatchesFound] = useState(0);
  const [totalPairs, setTotalPairs] = useState(0);
  const [potentialReward, setPotentialReward] = useState("0");
  const [maxFlips, setMaxFlips] = useState(0);
  const [flips, setFlips] = useState(0);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Calculate max flips based on grid size
  useEffect(() => {
    const totalCards = gridSize * gridSize;
    const totalPairs = totalCards / 2;
    // Allow 1.5x the number of pairs as max flips
    const calculatedLimit = Math.floor(totalPairs * 1.5);
    setMaxFlips(calculatedLimit);
  }, [gridSize]);

  // Calculate potential reward based on grid size
  const calculateReward = useCallback((size: number, bet: string) => {
    const betValue = parseFloat(bet);
    let multiplier = 1;

    switch (size) {
      case 2:
        multiplier = 1.2;
        break;
      case 3:
        multiplier = 1.5;
        break;
      case 4:
        multiplier = 2;
        break;
      case 5:
        multiplier = 2.5;
        break;
      case 6:
        multiplier = 3;
        break;
      case 7:
        multiplier = 3.5;
        break;
      case 8:
        multiplier = 4;
        break;
    }

    return (betValue * multiplier).toFixed(4);
  }, []);

  // Start a new game
  const startGame = useCallback(async () => {
    if (!address || !betAmount || parseFloat(betAmount) <= 0) {
      console.error("Invalid game parameters");
      return;
    }

    try {
      setGameStatus("starting");
      const pairs = (gridSize * gridSize) / 2;
      setTotalPairs(pairs);
      setMatchesFound(0);
      setFlips(0);

      const reward = calculateReward(gridSize, betAmount);
      setPotentialReward(reward);

      writeContract({
        address: MEMORY_GAME_ADDRESS,
        abi: MEMORY_GAME_ABI,
        functionName: "startGame",
        args: [BigInt(gridSize)],
        value: parseEther(betAmount),
      });
    } catch (error) {
      console.error("Error starting game:", error);
      setGameStatus("idle");
    }
  }, [address, betAmount, gridSize, writeContract, calculateReward]);

  // Record a match
  const recordMatch = useCallback(
    (correct: boolean) => {
      if (!address || gameStatus !== "playing") return;

      try {
        if (correct) {
          setMatchesFound((prev) => prev + 1);
        }
        // No blockchain transaction needed for tracking matches locally
      } catch (error) {
        console.error("Error recording match:", error);
      }
    },
    [address, gameStatus]
  );

  // End the game
  const endGame = useCallback(async () => {
    if (!address || gameStatus !== "playing") return;

    try {
      setGameStatus("claiming");

      writeContract({
        address: MEMORY_GAME_ADDRESS,
        abi: MEMORY_GAME_ABI,
        functionName: "endGame",
      });
    } catch (error) {
      console.error("Error ending game:", error);
      setGameStatus("idle");
    }
  }, [address, gameStatus, writeContract]);

  // Handle transaction confirmation
  const handleConfirmation = useCallback(() => {
    if (isConfirmed && gameStatus === "starting") {
      setGameStatus("playing");
    } else if (isConfirmed && gameStatus === "claiming") {
      setGameStatus("completed");
    }
  }, [isConfirmed, gameStatus]);

  // Reset game
  const resetGame = useCallback(() => {
    setGameStatus("idle");
    setMatchesFound(0);
    setTotalPairs(0);
    setPotentialReward("0");
    setFlips(0);
  }, []);

  // Update grid size and recalculate reward
  const updateGridSize = useCallback(
    (size: number) => {
      setGridSize(size);
      const reward = calculateReward(size, betAmount);
      setPotentialReward(reward);
    },
    [betAmount, calculateReward]
  );

  // Update bet amount and recalculate reward
  const updateBetAmount = useCallback(
    (amount: string) => {
      setBetAmount(amount);
      const reward = calculateReward(gridSize, amount);
      setPotentialReward(reward);
    },
    [gridSize, calculateReward]
  );

  // Increment flip count
  const incrementFlips = useCallback(() => {
    setFlips((prev) => prev + 1);
  }, []);

  // Check if game is over due to flip limit
  const checkFlipLimit = useCallback(() => {
    if (flips >= maxFlips && gameStatus === "playing") {
      setGameStatus("completed");
      return true;
    }
    return false;
  }, [flips, maxFlips, gameStatus]);

  return {
    // State
    gridSize,
    betAmount,
    gameStatus,
    matchesFound,
    totalPairs,
    potentialReward,
    maxFlips,
    flips,
    isLoading: isPending || isConfirming,
    isConfirmed,

    // Actions
    startGame,
    recordMatch,
    endGame,
    resetGame,
    updateGridSize,
    updateBetAmount,
    handleConfirmation,
    incrementFlips,
    checkFlipLimit,
  };
}
