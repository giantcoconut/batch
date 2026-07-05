'use client';

import type { AtomDraft, AtomSchemaType } from '@/types/atoms';

function isRichSchema(schemaType: AtomSchemaType): boolean {
  return schemaType === 'Thing' || schemaType === 'Person' || schemaType === 'Organization';
}

export function AtomDraftRowEditor({
  draft,
  index,
  disabled,
  onPatch,
  onRemove,
}: {
  draft: AtomDraft;
  index: number;
  disabled?: boolean;
  onPatch: (patch: Partial<AtomDraft>) => void;
  onRemove: () => void;
}) {
  const setSchemaType = (schemaType: AtomSchemaType) => {
    onPatch({
      schemaType,
      ...(isRichSchema(schemaType)
        ? {}
        : {
            name: '',
            description: '',
            url: '',
            image: '',
            email: '',
            identifier: '',
          }),
      ...(schemaType === 'Account'
        ? {}
        : {
            accountChainId: '1',
            accountAddress: '',
          }),
      ...(schemaType === 'Raw'
        ? {}
        : {
            rawData: '',
          }),
    });
  };

  return (
    <div className="rounded-[1.15rem] border border-line/80 bg-paper/60 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.72rem] uppercase tracking-terminal text-muted">Atom {index + 1}</p>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={draft.schemaType}
            onChange={(event) => setSchemaType(event.target.value as AtomSchemaType)}
            disabled={disabled}
            className="rounded-full border border-line bg-white/80 px-3 py-2 text-sm text-ink outline-none"
          >
            {(['Thing', 'Person', 'Organization', 'Account', 'Raw'] as AtomSchemaType[]).map((schemaType) => (
              <option key={schemaType} value={schemaType}>
                {schemaType === 'Raw' ? 'Raw URI / data' : schemaType}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="inline-flex rounded-full border border-line bg-white/75 px-3 py-2 text-sm text-muted transition-colors duration-150 hover:border-ink/15 hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {isRichSchema(draft.schemaType) ? (
          <>
            <label className="space-y-2">
              <span className="text-sm text-muted">Name</span>
              <input
                value={draft.name}
                onChange={(event) => onPatch({ name: event.target.value })}
                disabled={disabled}
                className="w-full rounded-xl border border-line/80 bg-white/70 px-4 py-3 text-sm text-ink outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-muted">URL (optional)</span>
              <input
                value={draft.url}
                onChange={(event) => onPatch({ url: event.target.value })}
                disabled={disabled}
                placeholder="https://..."
                className="w-full rounded-xl border border-line/80 bg-white/70 px-4 py-3 text-sm text-ink outline-none"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm text-muted">Description</span>
              <textarea
                value={draft.description}
                onChange={(event) => onPatch({ description: event.target.value })}
                rows={3}
                disabled={disabled}
                className="w-full rounded-xl border border-line/80 bg-white/70 px-4 py-3 text-sm leading-7 text-ink outline-none"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm text-muted">Image URL (optional)</span>
              <input
                value={draft.image}
                onChange={(event) => onPatch({ image: event.target.value })}
                disabled={disabled}
                placeholder="https://... or ipfs://..."
                className="w-full rounded-xl border border-line/80 bg-white/70 px-4 py-3 text-sm text-ink outline-none"
              />
            </label>
            {(draft.schemaType === 'Person' || draft.schemaType === 'Organization') ? (
              <label className="space-y-2">
                <span className="text-sm text-muted">Email (optional)</span>
                <input
                  value={draft.email}
                  onChange={(event) => onPatch({ email: event.target.value })}
                  disabled={disabled}
                  className="w-full rounded-xl border border-line/80 bg-white/70 px-4 py-3 text-sm text-ink outline-none"
                />
              </label>
            ) : null}
            {draft.schemaType === 'Person' ? (
              <label className="space-y-2">
                <span className="text-sm text-muted">Identifier (optional)</span>
                <input
                  value={draft.identifier}
                  onChange={(event) => onPatch({ identifier: event.target.value })}
                  disabled={disabled}
                  className="w-full rounded-xl border border-line/80 bg-white/70 px-4 py-3 text-sm text-ink outline-none"
                />
              </label>
            ) : null}
          </>
        ) : null}

        {draft.schemaType === 'Account' ? (
          <>
            <label className="space-y-2">
              <span className="text-sm text-muted">Account chain ID</span>
              <input
                value={draft.accountChainId}
                onChange={(event) => onPatch({ accountChainId: event.target.value })}
                disabled={disabled}
                className="w-full rounded-xl border border-line/80 bg-white/70 px-4 py-3 text-sm text-ink outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-muted">Address</span>
              <input
                value={draft.accountAddress}
                onChange={(event) => onPatch({ accountAddress: event.target.value })}
                disabled={disabled}
                placeholder="0x..."
                className="w-full rounded-xl border border-line/80 bg-white/70 px-4 py-3 font-mono text-sm text-ink outline-none"
              />
            </label>
          </>
        ) : null}

        {draft.schemaType === 'Raw' ? (
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm text-muted">Exact URI or raw data string</span>
            <textarea
              value={draft.rawData}
              onChange={(event) => onPatch({ rawData: event.target.value })}
              rows={3}
              disabled={disabled}
              className="w-full rounded-xl border border-line/80 bg-white/70 px-4 py-3 font-mono text-sm leading-7 text-ink outline-none"
            />
          </label>
        ) : null}

        <label className="space-y-2">
          <span className="text-sm text-muted">Initial support (optional)</span>
          <input
            value={draft.support}
            onChange={(event) => onPatch({ support: event.target.value })}
            disabled={disabled}
            placeholder="0"
            className="w-full rounded-xl border border-line/80 bg-white/70 px-4 py-3 text-sm text-ink outline-none"
          />
        </label>
      </div>
    </div>
  );
}
