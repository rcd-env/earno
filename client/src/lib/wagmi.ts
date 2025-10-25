import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { celoAlfajores } from "./config";

export const config = getDefaultConfig({
  appName: "Earno",
  projectId:
    import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ||
    "YOUR_WALLETCONNECT_PROJECT_ID",
  chains: [celoAlfajores],
  ssr: false,
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
