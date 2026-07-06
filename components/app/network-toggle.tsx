'use client';

import { useMemo, useState } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';

import { useSelectedNetwork } from '@/components/app/network-provider';
import { getIntuitionNetwork, getIntuitionNetworkByChainId, INTUITION_NETWORKS } from '@/lib/intuition/networks';
import type { PublicIntuitionNetwork } from '@/types/api';

export function NetworkToggle() {
  const { network, setNetwork } = useSelectedNetwork();
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync, isPending } = useSwitchChain();
  const [error, setError] = useState<string | null>(null);

  const walletNetwork = getIntuitionNetworkByChainId(chainId ?? null);
  const mismatch = isConnected && walletNetwork !== null && walletNetwork.key !== network;

  const helperText = useMemo(() => {
    if (error) {
      return error;
    }

    if (!isConnected) {
      return 'Choose the target network first, then connect a wallet when you are ready to publish.';
    }

    if (mismatch) {
      return `Targeting ${getIntuitionNetwork(network).name}. Switch your wallet before publishing.`;
    }

    return `Wallet ready on ${getIntuitionNetwork(network).name}.`;
  }, [error, isConnected, mismatch, network]);

  async function handleSelect(nextNetwork: PublicIntuitionNetwork) {
    if (nextNetwork === network) {
      return;
    }

    setError(null);
    setNetwork(nextNetwork);

    const nextConfig = getIntuitionNetwork(nextNetwork);
    if (!isConnected || chainId === nextConfig.chainId || !switchChainAsync) {
      return;
    }

    try {
      await switchChainAsync({ chainId: nextConfig.chainId });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? `Wallet switch to ${nextConfig.name} was not completed: ${caughtError.message}`
          : `Wallet switch to ${nextConfig.name} was not completed.`,
      );
    }
  }

  return (
    <div className="space-y-2">
      <div className="inline-flex rounded-full border border-line bg-white/85 p-1">
        {(Object.keys(INTUITION_NETWORKS) as PublicIntuitionNetwork[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              void handleSelect(option);
            }}
            disabled={isPending}
            className={`rounded-full px-4 py-2 text-sm transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-70 ${
              network === option ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
            }`}
            aria-pressed={network === option}
          >
            {option === 'mainnet' ? 'Mainnet' : 'Testnet'}
          </button>
        ))}
      </div>
      <p className={`max-w-[22rem] text-xs leading-5 ${error ? 'text-[#a33a2b]' : 'text-muted'}`}>{helperText}</p>
    </div>
  );
}
