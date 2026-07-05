import type { Hex } from 'viem';

import type { IntuitionAtomSearchResult } from '@/types/api';

export interface ListDraft {
  id: string;
  listAtom: IntuitionAtomSearchResult | null;
  mode: 'manual' | 'csv';
}

export interface ListMemberRow {
  id: string;
  sourceLine?: number;
  memberName: string;
  memberDescription: string;
  selectedAtom: IntuitionAtomSearchResult | null;
  candidates: IntuitionAtomSearchResult[];
}

export interface PreparedListEntry {
  id: string;
  listTermId: Hex;
  memberTermId: Hex;
  tripleId: Hex;
  alreadyExistsOnChain: boolean;
}
