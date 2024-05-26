import { http, createConfig, Config } from "wagmi";
import { sepolia } from "wagmi/chains";
import { defineChain } from "viem";

export const local = defineChain({
  id: 31337,
  name: "Local",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
  },
});

export let config: Config;

if (process.env.NODE_ENV === "development") {
  config = createConfig({
    chains: [sepolia, local],
    transports: {
      [sepolia.id]: http(import.meta.env.VITE_SEPOLIA_RPC_URL),
      [local.id]: http(),
    },
  });
} else {
  config = createConfig({
    chains: [sepolia],
    ssr: true,
    transports: {
      [sepolia.id]: http(import.meta.env.VITE_SEPOLIA_RPC_URL),
    },
  });
}
