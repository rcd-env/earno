import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import { celoAlfajores } from "./config";

export const config = getDefaultConfig({
  appName: "Earno",
  projectId:
    import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ||
    "YOUR_WALLETCONNECT_PROJECT_ID",
  chains: [celoAlfajores],
  transports: {
    [celoAlfajores.id]: http("https://alfajores-forno.celo-testnet.org", {
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
