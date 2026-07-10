'use client';

import '@rainbow-me/rainbowkit/styles.css';

import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';

import { SelectedNetworkProvider } from '@/components/app/network-provider';
import { WalletIdentityAvatar } from '@/components/wallet/wallet-identity-avatar';
import { walletConfig } from '@/lib/intuition/wallet-config';

const rainbowTheme = lightTheme({
  accentColor: '#231714',
  accentColorForeground: '#f8f2ea',
  borderRadius: 'medium',
  fontStack: 'system',
  overlayBlur: 'small',
});

function WalletAvatar({
  address,
  ensImage,
  size,
}: {
  address: string;
  ensImage?: string | null;
  size: number;
}) {
  return <WalletIdentityAvatar address={address as `0x${string}`} ensImage={ensImage} size={size} />;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={walletConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rainbowTheme} modalSize="compact" avatar={WalletAvatar}>
          <SelectedNetworkProvider>{children}</SelectedNetworkProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
