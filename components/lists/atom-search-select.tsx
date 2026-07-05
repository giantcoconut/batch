'use client';

import { useState } from 'react';

import { searchAtoms } from '@/lib/intuition/search';
import { resolveIntuitionImageUrl } from '@/lib/intuition/images';
import type { IntuitionAtomSearchResult, PublicIntuitionNetwork } from '@/types/api';

export function AtomSearchSelect({
  label,
  network,
  preferredCreatorAddress,
  selectedAtom,
  query,
  placeholder,
  disabled,
  helperText,
  onQueryChange,
  onSelect,
  onClear,
}: {
  label: string;
  network: PublicIntuitionNetwork;
  preferredCreatorAddress?: string | null | undefined;
  selectedAtom: IntuitionAtomSearchResult | null;
  query: string;
  placeholder: string;
  disabled?: boolean | undefined;
  helperText?: string | undefined;
  onQueryChange: (value: string) => void;
  onSelect: (atom: IntuitionAtomSearchResult) => void;
  onClear?: (() => void) | undefined;
}) {
  const [results, setResults] = useState<IntuitionAtomSearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  async function handleSearch() {
    if (!query.trim()) {
      setResults([]);
      setError('Enter a search term first.');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const nextResults = await searchAtoms(network, query, false, 8, preferredCreatorAddress);
      setResults(nextResults);

      if (nextResults.length === 0) {
        setError('No matching atoms were found.');
      }
    } catch (caughtError) {
      setResults([]);
      setError(caughtError instanceof Error ? caughtError.message : 'Atom search failed.');
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div className="space-y-3 rounded-[1.1rem] border border-line/80 bg-paper/60 p-4">
      <div className="space-y-2">
        <p className="text-[0.72rem] uppercase tracking-terminal text-muted">{label}</p>
        {helperText ? <p className="text-sm leading-7 text-muted">{helperText}</p> : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className="min-w-[16rem] flex-1 rounded-xl border border-line/80 bg-white/80 px-4 py-3 text-sm text-ink outline-none"
        />
        <button
          type="button"
          onClick={() => {
            void handleSearch();
          }}
          disabled={disabled || isSearching}
          className="inline-flex rounded-full border border-ink bg-ink px-4 py-2 text-sm text-paper transition-colors duration-150 hover:bg-[#3a2a23] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSearching ? 'Searching...' : 'Search atoms'}
        </button>
        {selectedAtom && onClear ? (
          <button
            type="button"
            onClick={onClear}
            disabled={disabled}
            className="inline-flex rounded-full border border-line bg-white/75 px-4 py-2 text-sm text-muted transition-colors duration-150 hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            Clear
          </button>
        ) : null}
      </div>

      {selectedAtom ? (
        <div className="rounded-xl border border-success/20 bg-success/10 p-4">
          <div className="flex gap-3">
            {resolveIntuitionImageUrl(selectedAtom.image) ? (
              <img
                src={resolveIntuitionImageUrl(selectedAtom.image) ?? undefined}
                alt=""
                className="h-12 w-12 rounded-lg border border-line/70 object-cover"
              />
            ) : null}
            <div className="space-y-1">
              <p className="text-sm text-ink">{selectedAtom.label}</p>
              <p className="text-[0.72rem] leading-5 text-muted">{selectedAtom.type}</p>
              <p className="break-all font-mono text-[0.72rem] leading-5 text-muted">{selectedAtom.termId}</p>
            </div>
          </div>
        </div>
      ) : null}

      {error ? <p className="text-sm leading-7 text-[#8a4b38]">{error}</p> : null}

      {results.length > 0 ? (
        <div className="space-y-3">
          {results.map((result) => (
            <button
              key={result.termId}
              type="button"
              onClick={() => onSelect(result)}
              disabled={disabled}
              className="w-full rounded-xl border border-line/80 bg-white/80 p-4 text-left transition-colors duration-150 hover:border-ink/15"
            >
              <div className="flex gap-3">
                {resolveIntuitionImageUrl(result.image) ? (
                  <img
                    src={resolveIntuitionImageUrl(result.image) ?? undefined}
                    alt=""
                    className="h-12 w-12 rounded-lg border border-line/70 object-cover"
                  />
                ) : null}
                <div className="space-y-1">
                  <p className="text-sm text-ink">{result.label}</p>
                  <p className="text-[0.72rem] leading-5 text-muted">
                    {result.type} · {result.positionCount} positions
                  </p>
                  {result.description ? <p className="text-[0.78rem] leading-6 text-muted">{result.description}</p> : null}
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
