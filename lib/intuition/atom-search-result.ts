import type { Address } from 'viem';

import type { AtomDraft, PreparedAtomDraft } from '@/types/atoms';
import type { IntuitionAtomSearchResult } from '@/types/api';

export function mapPreparedAtomToSearchResult(
  draft: AtomDraft,
  prepared: PreparedAtomDraft,
  creatorAddress?: Address | null,
): IntuitionAtomSearchResult {
  const label =
    draft.schemaType === 'Account'
      ? draft.accountAddress.trim()
      : draft.schemaType === 'Raw'
        ? draft.rawData.trim()
        : draft.name.trim();

  return {
    termId: prepared.atomId,
    label,
    type: draft.schemaType,
    data: prepared.dataString,
    description:
      draft.schemaType === 'Thing' || draft.schemaType === 'Person' || draft.schemaType === 'Organization'
        ? draft.description.trim() || null
        : null,
    image:
      draft.schemaType === 'Thing' || draft.schemaType === 'Person' || draft.schemaType === 'Organization'
        ? draft.image.trim() || null
        : null,
    url:
      draft.schemaType === 'Thing' || draft.schemaType === 'Person' || draft.schemaType === 'Organization'
        ? draft.url.trim() || null
        : null,
    creatorId: creatorAddress ?? null,
    creatorLabel: creatorAddress ?? null,
    positionCount: 0,
    totalShares: '0',
  };
}
