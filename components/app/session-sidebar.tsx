'use client';

import { useAccount, useChainId } from 'wagmi';

import { NetworkBadge } from '@/components/app/network-badge';
import { getIntuitionNetworkByChainId } from '@/lib/intuition/networks';
import { formatAddress } from '@/lib/utils/format';

export function SessionSidebar() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const network = getIntuitionNetworkByChainId(chainId ?? null);

  return (
    <aside className="border border-line/80 bg-white/70 p-6 shadow-sheet xl:sticky xl:top-24">
      <div className="space-y-5">
        <div className="space-y-2">
          <p className="text-[0.72rem] uppercase tracking-terminal text-muted">Session</p>
          <p className="font-serif text-[1.55rem] leading-none tracking-[-0.045em] text-ink sm:text-[1.7rem]">
            Intuition write foundation.
          </p>
          <p className="text-sm leading-7 text-muted">
            Wallet and network state are wired in now so the batch review flows can layer on cleanly.
          </p>
        </div>
        <div className="rounded-[1.05rem] border border-line/80 bg-paper/70 p-4">
          <p className="text-[0.68rem] uppercase tracking-terminal text-muted">Wallet</p>
          <p className="mt-2 text-sm leading-6 text-ink">{isConnected ? formatAddress(address ?? null) : 'Not connected'}</p>
        </div>
        <div className="rounded-[1.05rem] border border-line/80 bg-paper/70 p-4">
          <p className="text-[0.68rem] uppercase tracking-terminal text-muted">Network</p>
          <div className="mt-2">
            <NetworkBadge chainId={chainId ?? null} />
          </div>
          {network ? <p className="mt-3 text-sm leading-6 text-muted">Configured for {network.nativeSymbol} writes.</p> : null}
        </div>
      </div>
    </aside>
  );
}
