// Contract Address - Update this after deploying to Celo Alfajores
export const MEMORY_GAME_ADDRESS =
  "0x0000000000000000000000000000000000000000" as `0x${string}`;

// Contract ABI
export const MEMORY_GAME_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "payout",
        type: "uint256",
      },
      { indexed: false, internalType: "bool", name: "won", type: "bool" },
    ],
    name: "GameEnded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "gridSize",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "betAmount",
        type: "uint256",
      },
    ],
    name: "GameStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      { indexed: false, internalType: "bool", name: "correct", type: "bool" },
      {
        indexed: false,
        internalType: "uint256",
        name: "matchesFound",
        type: "uint256",
      },
    ],
    name: "MatchRecorded",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "gridSize", type: "uint256" },
      { internalType: "uint256", name: "bet", type: "uint256" },
    ],
    name: "calculateReward",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "endGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "games",
    outputs: [
      { internalType: "uint256", name: "gridSize", type: "uint256" },
      { internalType: "uint256", name: "betAmount", type: "uint256" },
      { internalType: "uint256", name: "matchesFound", type: "uint256" },
      { internalType: "uint256", name: "totalPairs", type: "uint256" },
      { internalType: "bool", name: "isActive", type: "bool" },
      { internalType: "uint256", name: "startTime", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "player", type: "address" }],
    name: "getGameState",
    outputs: [
      { internalType: "uint256", name: "gridSize", type: "uint256" },
      { internalType: "uint256", name: "betAmount", type: "uint256" },
      { internalType: "uint256", name: "matchesFound", type: "uint256" },
      { internalType: "uint256", name: "totalPairs", type: "uint256" },
      { internalType: "bool", name: "isActive", type: "bool" },
      { internalType: "uint256", name: "startTime", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "player", type: "address" }],
    name: "getTotalWinnings",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bool", name: "correct", type: "bool" }],
    name: "recordMatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "gridSize", type: "uint256" }],
    name: "startGame",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "totalWinnings",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;
