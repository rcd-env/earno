import { defineChain } from "viem";
import { sepolia } from "viem/chains";

// Celo Mainnet
export const celoMainnet = defineChain({
  id: 42220,
  name: "Celo Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Celo",
    symbol: "CELO",
  },
  rpcUrls: {
    default: {
      http: ["https://forno.celo.org", "https://rpc.ankr.com/celo"],
    },
    public: {
      http: ["https://forno.celo.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "CeloScan",
      url: "https://celoscan.io",
    },
  },
  testnet: false,
});

// Celo Alfajores Testnet with multiple RPC endpoints for better reliability
export const celoAlfajores = defineChain({
  id: 44787,
  name: "Celo Alfajores Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Celo",
    symbol: "CELO",
  },
  rpcUrls: {
    default: {
      http: [
        "https://alfajores-forno.celo-testnet.org",
        "https://celo-alfajores.infura.io/v3/",
        "https://alfajores-forno.celo.org",
      ],
    },
    public: {
      http: [
        "https://alfajores-forno.celo-testnet.org",
        "https://alfajores-forno.celo.org",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Celo Explorer",
      url: "https://alfajores.celoscan.io",
    },
  },
  testnet: true,
});

export const celoSepoliaTestnet = defineChain({
  id: 11142220,
  name: "Celo Sepolia Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Celo Sepolia Testnet",
    symbol: "CELO",
  },
  rpcUrls: {
    default: { http: ["https://forno.celo-sepolia.celo-testnet.org/"] },
    public: { http: ["https://forno.celo-sepolia.celo-testnet.org/"] },
  },
  blockExplorers: {
    default: {
      name: "Celo Sepolia Testnet Explorer",
      url: "https://celo-sepolia.blockscout.com/",
    },
  },
  testnet: true,
});

export { sepolia };
