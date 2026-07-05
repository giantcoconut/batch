'use client';

import { formatEther } from 'viem';

import { ReviewStatusPill } from '@/components/app/review-status-pill';
import { resolveIntuitionImageUrl } from '@/lib/intuition/images';
import type { IntuitionAtomSearchResult } from '@/types/api';
import type { ManualListReviewRow } from '@/types/lists';

export function ListReviewTable({
  rows,
  nativeSymbol,
  onSelectCandidate,
  onRemoveRow,
}: {
  rows: ManualListReviewRow[];
  nativeSymbol: string;
  onSelectCandidate?: ((rowId: string, atom: IntuitionAtomSearchResult) => void) | undefined;
  onRemoveRow?: ((rowId: string) => void) | undefined;
}) {
  return (
    <div className="rounded-[1.15rem] border border-dashed border-line bg-paper/60 p-4">
      <div className="space-y-2">
        <p className="text-[0.72rem] uppercase tracking-terminal text-muted">List review</p>
        <p className="text-sm leading-7 text-muted">
          Review each member entry before publishing. Only `ready_to_create` rows are eligible for the batch transaction.
        </p>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-[0.68rem] uppercase tracking-terminal text-muted">
            <tr>
              <th className="px-3 py-3">Member atom</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Cost</th>
              <th className="px-3 py-3">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/70">
            {rows.map((row) => {
              const previewImageUrl = resolveIntuitionImageUrl(row.payload.row.selectedAtom?.image);

              return (
                <tr key={row.id}>
                  <td className="px-3 py-3 align-top text-ink">
                    <div className="flex gap-3">
                      {previewImageUrl ? (
                        <img src={previewImageUrl} alt="" className="mt-1 h-12 w-12 rounded-lg border border-line/70 object-cover" />
                      ) : null}
                      <div className="space-y-1">
                        <p>{row.payload.row.selectedAtom?.label ?? row.payload.row.memberName ?? row.label}</p>
                        {row.payload.prepared ? (
                          <p className="break-all font-mono text-[0.72rem] leading-5 text-muted">{row.payload.prepared.tripleId}</p>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 align-top">
                    <ReviewStatusPill status={row.status} />
                  </td>
                  <td className="px-3 py-3 align-top text-muted">
                    {row.payload.prepared ? `${Number.parseFloat(formatEther(row.payload.prepared.assetWei)).toFixed(3).replace(/\.?0+$/, '')} ${nativeSymbol}` : '—'}
                  </td>
                  <td className="px-3 py-3 align-top text-muted">
                    <p>{row.message}</p>
                    {row.payload.errors?.length ? (
                      <div className="mt-1 space-y-1">
                        {row.payload.errors.map((error) => (
                          <p key={`${row.id}-${error}`} className="text-[#8a4b38]">
                            {error}
                          </p>
                        ))}
                      </div>
                    ) : null}
                    {row.status === 'ambiguous' && row.payload.row.candidates.length > 0 && onSelectCandidate ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {row.payload.row.candidates.map((candidate) => (
                          <button
                            key={`${row.id}-${candidate.termId}`}
                            type="button"
                            onClick={() => onSelectCandidate(row.id, candidate)}
                            className="rounded-full border border-line bg-white/80 px-3 py-1.5 text-[0.72rem] text-ink transition-colors duration-150 hover:border-ink/20"
                          >
                            Use {candidate.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                    {(row.status === 'ambiguous' || row.status === 'missing' || row.status === 'invalid') && onRemoveRow ? (
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => onRemoveRow(row.id)}
                          className="rounded-full border border-line bg-white/80 px-3 py-1.5 text-[0.72rem] text-muted transition-colors duration-150 hover:text-ink"
                        >
                          Remove row
                        </button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
