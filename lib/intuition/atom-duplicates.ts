import { stringToHex, type Hex } from 'viem';

import type { ReviewRow } from '@/types/review';
import type { IntuitionAtomSearchResult } from '@/types/api';
import type { AtomDraft, PreparedAtomDraft } from '@/types/atoms';

function createDuplicateKey(prepared: PreparedAtomDraft): string {
  return prepared.dataString.trim().toLowerCase();
}

export function buildAtomReviewRows(
  drafts: AtomDraft[],
  preparedDrafts: PreparedAtomDraft[],
  existingMatches: Map<string, IntuitionAtomSearchResult> = new Map(),
): ReviewRow<PreparedAtomDraft>[] {
  const counts = new Map<string, number>();

  for (const prepared of preparedDrafts) {
    const key = createDuplicateKey(prepared);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const draftMap = new Map(drafts.map((draft) => [draft.id, draft]));

  return preparedDrafts.map((prepared) => {
    const duplicateKey = createDuplicateKey(prepared);
    const duplicateCount = counts.get(duplicateKey) ?? 0;
    const existingMatch = existingMatches.get(prepared.id);
    const sourceDraft = draftMap.get(prepared.id);

    if (!sourceDraft) {
      return {
        id: prepared.id,
        label: prepared.displayName,
        status: 'invalid',
        message: 'The source atom draft is missing.',
        payload: prepared,
      };
    }

    if (prepared.existsOnChain) {
      return {
        id: prepared.id,
        label: prepared.displayName,
        status: existingMatch ? 'skip_existing' : 'existing',
        message: existingMatch ? 'This atom already exists and will be skipped.' : 'This atom already exists on-chain.',
        payload: prepared,
      };
    }

    if (duplicateCount > 1) {
      return {
        id: prepared.id,
        label: prepared.displayName,
        status: 'blocked_duplicate',
        message: 'This atom appears more than once in the current batch.',
        payload: prepared,
      };
    }

    if (!prepared.displayName.trim() || stringToHex(prepared.dataString).length <= 2) {
      return {
        id: prepared.id,
        label: prepared.displayName || 'Untitled atom',
        status: 'invalid',
        message: 'This atom is missing required data.',
        payload: prepared,
      };
    }

    return {
      id: prepared.id,
      label: prepared.displayName,
      status: 'ready_to_create',
      message: 'This atom is valid and ready to create.',
      payload: prepared,
    };
  });
}

export function filterCreatableAtoms(rows: ReviewRow<PreparedAtomDraft>[]): PreparedAtomDraft[] {
  return rows.filter((row) => row.status === 'ready_to_create').map((row) => row.payload);
}
