import { ChainId } from "./cctp-sdk/constants";

interface INetwork {
  rpcUrls: string[];
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls: string[];
}

export const NETWORKS: { [id in ChainId]: INetwork } = {
  [ChainId.Avalanche]: {
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    chainName: "Avalanche Network C-Chain",
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18
    },
    blockExplorerUrls: ["https://snowtrace.io/"]
  },
  [ChainId.Arbitrum]: {
    rpcUrls: ["https://arbitrum.llamarpc.com"],
    chainName: "Arbitrum One",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18
    },
    blockExplorerUrls: ["https://explorer.arbitrum.io"]
  },
};
