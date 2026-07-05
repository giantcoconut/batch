'use client';

import { getAtomDisplayName } from '@/lib/intuition/atom-prepare';
import { resolveIntuitionImageUrl } from '@/lib/intuition/images';
import type { CsvAtomParseRow } from '@/types/atoms';

export function CsvAtomPreviewTable({ rows }: { rows: CsvAtomParseRow[] }) {
  return (
    <div className="rounded-[1.15rem] border border-dashed border-line bg-paper/60 p-4">
      <div className="space-y-2">
        <p className="text-[0.72rem] uppercase tracking-terminal text-muted">Parsed CSV rows</p>
        <p className="text-sm leading-7 text-muted">
          Preview the imported rows before running duplicate and existing-atom checks.
        </p>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-[0.68rem] uppercase tracking-terminal text-muted">
            <tr>
              <th className="px-3 py-3">Line</th>
              <th className="px-3 py-3">Atom</th>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Image</th>
              <th className="px-3 py-3">Parse notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/70">
            {rows.map((row) => {
              const previewImageUrl = resolveIntuitionImageUrl(row.atom.image);

              return (
                <tr key={row.atom.id}>
                  <td className="px-3 py-3 align-top text-muted">{row.atom.sourceLine}</td>
                  <td className="px-3 py-3 align-top text-ink">
                    <div className="space-y-1">
                      <p>{getAtomDisplayName(row.atom) || 'Untitled atom'}</p>
                      <p className="break-all text-[0.72rem] leading-5 text-muted">
                        {row.atom.schemaType === 'Raw'
                          ? row.atom.rawData
                          : row.atom.schemaType === 'Account'
                            ? row.atom.accountAddress
                            : row.atom.description || row.atom.url || 'No extra metadata'}
                      </p>
                    </div>
                  </td>
                  <td className="px-3 py-3 align-top text-muted">{row.atom.schemaType}</td>
                  <td className="px-3 py-3 align-top text-muted">
                    {previewImageUrl ? (
                      <img src={previewImageUrl} alt="" className="h-12 w-12 rounded-lg border border-line/70 object-cover" />
                    ) : row.atom.image.trim() ? (
                      'Unpreviewable'
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-3 py-3 align-top text-muted">
                    {row.errors.length > 0 ? (
                      <div className="space-y-1">
                        {row.errors.map((error) => (
                          <p key={`${row.atom.id}-${error}`} className="text-[#8a4b38]">
                            {error}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p>{row.atom.image.trim() && !previewImageUrl ? 'Ready for chain review, but the image value cannot be previewed here.' : 'Ready for chain review.'}</p>
                    )}
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
