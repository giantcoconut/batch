import type { IntuitionAtomSearchResult, PublicIntuitionNetwork } from '@/types/api';

export function matchesCreatorAddress(atom: IntuitionAtomSearchResult, walletAddress?: string | null): boolean {
  if (!walletAddress) {
    return false;
  }

  const normalizedWallet = walletAddress.trim().toLowerCase();

  return (
    atom.creatorId?.trim().toLowerCase() === normalizedWallet ||
    atom.creatorLabel?.trim().toLowerCase() === normalizedWallet
  );
}

export function sortAtomsForWalletPreference(
  results: IntuitionAtomSearchResult[],
  walletAddress?: string | null,
): IntuitionAtomSearchResult[] {
  if (!walletAddress) {
    return results;
  }

  return results.slice().sort((left, right) => {
    const leftPreferred = matchesCreatorAddress(left, walletAddress) ? 1 : 0;
    const rightPreferred = matchesCreatorAddress(right, walletAddress) ? 1 : 0;

    if (leftPreferred !== rightPreferred) {
      return rightPreferred - leftPreferred;
    }

    if (left.positionCount !== right.positionCount) {
      return right.positionCount - left.positionCount;
    }

    return right.totalShares.localeCompare(left.totalShares);
  });
}

export async function searchAtoms(
  network: PublicIntuitionNetwork,
  query: string,
  exact: boolean,
  limit: number,
  preferredCreatorAddress?: string | null,
  signal?: AbortSignal,
): Promise<IntuitionAtomSearchResult[]> {
  const requestInit: RequestInit = {};

  if (signal) {
    requestInit.signal = signal;
  }

  const response = await fetch(
    `/api/intuition/search-atoms?network=${network}&q=${encodeURIComponent(query)}&exact=${exact ? '1' : '0'}&limit=${limit}`,
    requestInit,
  );

  const payload = (await response.json()) as {
    results?: IntuitionAtomSearchResult[];
    error?: string;
  };

  if (!response.ok) {
    throw new Error(payload.error ?? 'Atom search failed.');
  }

  return sortAtomsForWalletPreference(payload.results ?? [], preferredCreatorAddress);
}
