'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import type { PublicIntuitionNetwork } from '@/types/api';

type SelectedNetworkContextValue = {
  network: PublicIntuitionNetwork;
  setNetwork: (network: PublicIntuitionNetwork) => void;
};

const SelectedNetworkContext = createContext<SelectedNetworkContextValue | null>(null);

export function SelectedNetworkProvider({ children }: { children: ReactNode }) {
  const [network, setNetwork] = useState<PublicIntuitionNetwork>('testnet');
  const value = useMemo(() => ({ network, setNetwork }), [network]);

  return <SelectedNetworkContext.Provider value={value}>{children}</SelectedNetworkContext.Provider>;
}

export function useSelectedNetwork() {
  const context = useContext(SelectedNetworkContext);

  if (!context) {
    throw new Error('useSelectedNetwork must be used inside SelectedNetworkProvider.');
  }

  return context;
}
