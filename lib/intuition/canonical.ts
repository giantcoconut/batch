import type { IntuitionAtomSearchResult, PublicIntuitionNetwork } from '@/types/api';

export async function lookupCanonicalAtom(
  network: PublicIntuitionNetwork,
  label: string,
  signal?: AbortSignal,
): Promise<IntuitionAtomSearchResult | null> {
  const requestInit: RequestInit = {};

  if (signal) {
    requestInit.signal = signal;
  }

  const response = await fetch(
    `/api/intuition/canonical-atom?network=${network}&label=${encodeURIComponent(label)}`,
    requestInit,
  );

  const payload = (await response.json()) as {
    atom?: IntuitionAtomSearchResult | null;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(payload.error ?? 'Canonical atom lookup failed.');
  }

  return payload.atom ?? null;
}
