'use client';

import { useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';

export interface EnsProfile {
  name: string;
  avatar: string | null;
}

interface EnsProfileResponse {
  profile: EnsProfile | null;
}

async function fetchEnsProfile(address: Address, signal: AbortSignal): Promise<EnsProfile | null> {
  const response = await fetch(`/api/ens-profile?address=${encodeURIComponent(address)}`, { signal });

  if (!response.ok) {
    throw new Error('ENS resolution failed.');
  }

  const payload = (await response.json()) as EnsProfileResponse;
  return payload.profile;
}

export function useEnsProfile(address?: Address) {
  return useQuery({
    queryKey: ['ens-profile', address?.toLowerCase()],
    queryFn: ({ signal }) => fetchEnsProfile(address as Address, signal),
    enabled: Boolean(address),
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });
}
