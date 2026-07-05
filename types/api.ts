import type { Hex } from 'viem';

import type { ReviewStatus } from '@/types/review';

export type PublicIntuitionNetwork = 'mainnet' | 'testnet';

export interface IntuitionNetworkConfig {
  key: PublicIntuitionNetwork;
  name: string;
  chainId: number;
  rpcUrl: string;
  graphqlUrl: string;
  explorerUrl: string;
  nativeSymbol: string;
  multiVault: Hex;
}

export interface IntuitionAtomSearchResult {
  termId: Hex;
  label: string;
  type: string;
  data: string | null;
  description: string | null;
  image: string | null;
  url: string | null;
  creatorId: string | null;
  creatorLabel: string | null;
  positionCount: number;
  totalShares: string;
}

export interface IntuitionPinRequest {
  network: PublicIntuitionNetwork;
  schemaType: 'Thing' | 'Person' | 'Organization';
  name: string;
  description?: string;
  image?: string;
  url?: string;
  email?: string;
  identifier?: string;
}

export interface IntuitionImageUploadInput {
  contentType: string;
  data: string;
  filename: string;
}

export interface IntuitionUploadedImage {
  url: string;
  safe?: boolean;
}

export interface ReviewSummaryCounts {
  readyToCreate: number;
  existing: number;
  skipped: number;
  blocked: number;
}

export interface StatusLabeledResult {
  status: ReviewStatus;
  message: string;
}
