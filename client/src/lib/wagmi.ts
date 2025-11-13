import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import { celoMainnet, celoAlfajores } from "./config";

// Use mainnet by default, can override with env variable
const USE_MAINNET = import.meta.env.VITE_USE_MAINNET !== "false";
const activeChain = USE_MAINNET ? celoMainnet : celoAlfajores;
const rpcUrl = USE_MAINNET
  ? "https://forno.celo.org"
  : "https://alfajores-forno.celo-testnet.org";

export const config = getDefaultConfig({
  appName: "Earno",
  projectId:
    import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ||
    "YOUR_WALLETCONNECT_PROJECT_ID",
  chains: [activeChain],
  transports: {
    [activeChain.id]: http(rpcUrl, {
      batch: {
        wait: 100, // Batch requests to reduce RPC calls
      },
      retryCount: 3, // Retry failed requests
      retryDelay: 1000, // Wait 1s between retries
      timeout: 30_000, // 30s timeout
    }),
  },
  ssr: false,
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
