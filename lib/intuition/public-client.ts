import { createPublicClient, http, type PublicClient } from 'viem';

import { INTUITION_CHAINS, getIntuitionNetwork } from '@/lib/intuition/networks';
import type { PublicIntuitionNetwork } from '@/types/api';

export function createIntuitionPublicClient(network: PublicIntuitionNetwork): PublicClient {
  const config = getIntuitionNetwork(network);

  return createPublicClient({
    chain: INTUITION_CHAINS[network],
    transport: http(config.rpcUrl),
  });
}
