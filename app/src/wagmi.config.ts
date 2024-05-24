import { http, createConfig, Config } from "wagmi";
import { polygon, base, baseSepolia } from "wagmi/chains";
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
    chains: [baseSepolia, base, local],
    transports: {
      [base.id]: http(),
      [baseSepolia.id]: http(),
      [local.id]: http(),
    },
  });
} else {
  config = createConfig({
    chains: [base],
    ssr: true,
    transports: {
      [base.id]: http(),
    },
  });
}
