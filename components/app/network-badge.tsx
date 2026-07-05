import { getIntuitionNetworkByChainId } from '@/lib/intuition/networks';

export function NetworkBadge({ chainId }: { chainId: number | null }) {
  const network = getIntuitionNetworkByChainId(chainId);

  return (
    <span className="inline-flex rounded-full border border-line bg-white/80 px-3 py-1 text-[0.68rem] uppercase tracking-terminal text-muted">
      {network ? network.name : chainId ? `Chain ${chainId}` : 'Not connected'}
    </span>
  );
}
