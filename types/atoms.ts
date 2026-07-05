import type { Hex } from 'viem';

import type { IntuitionAtomSearchResult } from '@/types/api';

export type AtomSchemaType = 'Thing' | 'Person' | 'Organization' | 'Account' | 'Raw';

export interface AtomDraft {
  id: string;
  schemaType: AtomSchemaType;
  name: string;
  description: string;
  url: string;
  image: string;
  email: string;
  identifier: string;
  accountChainId: string;
  accountAddress: string;
  rawData: string;
  support: string;
}

export interface CsvAtomRow extends AtomDraft {
  sourceLine: number;
  sourceRecord: Record<string, string>;
}

export interface PreparedAtomDraft {
  id: string;
  displayName: string;
  dataString: string;
  atomId: Hex;
  assetWei: bigint;
  supportWei: bigint;
  existsOnChain: boolean;
}

export interface AtomDuplicateInspection {
  draftId: string;
  duplicateKey: string;
  existingAtom: IntuitionAtomSearchResult | null;
  isDuplicateInBatch: boolean;
}
