import { defineChain, type Hex } from 'viem';

import type { IntuitionNetworkConfig, PublicIntuitionNetwork } from '@/types/api';

export const INTUITION_NETWORKS: Record<PublicIntuitionNetwork, IntuitionNetworkConfig> = {
  mainnet: {
    key: 'mainnet',
    name: 'Intuition Mainnet',
    chainId: 1155,
    rpcUrl: process.env.NEXT_PUBLIC_INTUITION_MAINNET_RPC_URL?.trim() || 'https://rpc.intuition.systems/http',
    graphqlUrl: process.env.INTUITION_MAINNET_GRAPHQL_URL?.trim() || 'https://mainnet.intuition.sh/v1/graphql',
    explorerUrl: process.env.NEXT_PUBLIC_INTUITION_MAINNET_EXPLORER_URL?.trim() || 'https://explorer.intuition.systems',
    nativeSymbol: 'TRUST',
    multiVault: '0x6E35cF57A41fA15eA0EaE9C33e751b01A784Fe7e' as Hex,
  },
  testnet: {
    key: 'testnet',
    name: 'Intuition Testnet',
    chainId: 13579,
    rpcUrl: process.env.NEXT_PUBLIC_INTUITION_TESTNET_RPC_URL?.trim() || 'https://testnet.rpc.intuition.systems/http',
    graphqlUrl: process.env.INTUITION_TESTNET_GRAPHQL_URL?.trim() || 'https://testnet.intuition.sh/v1/graphql',
    explorerUrl:
      process.env.NEXT_PUBLIC_INTUITION_TESTNET_EXPLORER_URL?.trim() || 'https://testnet.explorer.intuition.systems',
    nativeSymbol: 'tTRUST',
    multiVault: '0x2Ece8D4dEdcB9918A398528f3fa4688b1d2CAB91' as Hex,
  },
};

export const INTUITION_CHAINS = {
  mainnet: defineChain({
    id: INTUITION_NETWORKS.mainnet.chainId,
    name: 'Intuition',
    nativeCurrency: {
      decimals: 18,
      name: 'Intuition',
      symbol: 'TRUST',
    },
    rpcUrls: {
      default: { http: [INTUITION_NETWORKS.mainnet.rpcUrl] },
    },
    blockExplorers: {
      default: {
        name: 'Intuition Explorer',
        url: INTUITION_NETWORKS.mainnet.explorerUrl,
      },
    },
  }),
  testnet: defineChain({
    id: INTUITION_NETWORKS.testnet.chainId,
    name: 'Intuition Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'Test Trust',
      symbol: 'tTRUST',
    },
    rpcUrls: {
      default: { http: [INTUITION_NETWORKS.testnet.rpcUrl] },
    },
    blockExplorers: {
      default: {
        name: 'Intuition Testnet Explorer',
        url: INTUITION_NETWORKS.testnet.explorerUrl,
      },
    },
  }),
} as const;

export function getIntuitionNetwork(network: PublicIntuitionNetwork): IntuitionNetworkConfig {
  return INTUITION_NETWORKS[network];
}

export function getIntuitionNetworkByChainId(chainId: number | null): IntuitionNetworkConfig | null {
  if (chainId === null) {
    return null;
  }

  return Object.values(INTUITION_NETWORKS).find((network) => network.chainId === chainId) ?? null;
}
