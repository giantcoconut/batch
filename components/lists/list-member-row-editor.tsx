'use client';

import { AtomSearchSelect } from '@/components/lists/atom-search-select';
import type { IntuitionAtomSearchResult, PublicIntuitionNetwork } from '@/types/api';
import type { ListMemberRow } from '@/types/lists';

export function ListMemberRowEditor({
  row,
  index,
  network,
  preferredCreatorAddress,
  disabled,
  onPatch,
  onRemove,
}: {
  row: ListMemberRow;
  index: number;
  network: PublicIntuitionNetwork;
  preferredCreatorAddress?: string | null;
  disabled?: boolean;
  onPatch: (patch: Partial<ListMemberRow>) => void;
  onRemove: () => void;
}) {
  function handleSelect(atom: IntuitionAtomSearchResult) {
    onPatch({
      memberName: atom.label,
      selectedAtom: atom,
      candidates: [],
    });
  }

  return (
    <div className="rounded-[1.15rem] border border-line/80 bg-paper/60 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.72rem] uppercase tracking-terminal text-muted">Member {index + 1}</p>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="inline-flex rounded-full border border-line bg-white/75 px-3 py-2 text-sm text-muted transition-colors duration-150 hover:border-ink/15 hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          Remove
        </button>
      </div>

      <AtomSearchSelect
        label="Member atom"
        network={network}
        preferredCreatorAddress={preferredCreatorAddress}
        selectedAtom={row.selectedAtom}
        query={row.memberName}
        placeholder="Search member atom label"
        disabled={disabled}
        helperText="Search and select an existing atom to add to this list."
        onQueryChange={(value) =>
          onPatch({
            memberName: value,
            selectedAtom: row.selectedAtom?.label === value ? row.selectedAtom : null,
          })
        }
        onSelect={handleSelect}
        onClear={() => onPatch({ memberName: '', selectedAtom: null })}
      />
    </div>
  );
}
