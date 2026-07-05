import { getIntuitionNetwork } from '@/lib/intuition/networks';
import type { PublicIntuitionNetwork } from '@/types/api';

interface IntuitionGraphResponse<TData> {
  data?: TData;
  errors?: Array<{ message?: string }>;
}

export async function queryIntuitionGraph<TData, TVariables extends Record<string, unknown>>(
  network: PublicIntuitionNetwork,
  query: string,
  variables: TVariables,
  signal?: AbortSignal,
): Promise<TData> {
  const requestInit: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  };

  if (signal) {
    requestInit.signal = signal;
  }

  const response = await fetch(getIntuitionNetwork(network).graphqlUrl, requestInit);

  if (!response.ok) {
    throw new Error(`GraphQL request failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as IntuitionGraphResponse<TData>;

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message ?? 'Unknown GraphQL error').join('; '));
  }

  if (!payload.data) {
    throw new Error('GraphQL request returned no data.');
  }

  return payload.data;
}
