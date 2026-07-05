import { getDefaultConfig, type WalletList } from '@rainbow-me/rainbowkit';
import {
  backpackWallet,
  injectedWallet,
  magicEdenWallet,
  metaMaskWallet,
  phantomWallet,
  rabbyWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

import { INTUITION_CHAINS } from '@/lib/intuition/networks';

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim();

if (!walletConnectProjectId) {
  console.warn('[wallet-config] NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. WalletConnect will be unavailable.');
}

const wallets: WalletList = [
  {
    groupName: 'Installed',
    wallets: [rabbyWallet, phantomWallet, metaMaskWallet, backpackWallet, magicEdenWallet, injectedWallet],
  },
  ...(walletConnectProjectId
    ? [
        {
          groupName: 'Connect',
          wallets: [walletConnectWallet],
        },
      ]
    : []),
];

const config: ReturnType<typeof getDefaultConfig> = getDefaultConfig({
  appName: 'Intuition Batch Tool',
  appDescription: 'Batch create atoms and publish list entries on Intuition.',
  appUrl: process.env.NEXT_PUBLIC_APP_URL?.trim() || 'http://localhost:3000',
  projectId: walletConnectProjectId || 'missing-walletconnect-project-id',
  chains: [INTUITION_CHAINS.testnet, INTUITION_CHAINS.mainnet],
  wallets,
  ssr: true,
});

export const walletConfig: ReturnType<typeof getDefaultConfig> = config;
