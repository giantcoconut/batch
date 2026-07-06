'use client';

import { useState } from 'react';

import { CsvBatchAtomsFlow } from '@/components/atoms/csv-batch-atoms-flow';
import { ManualBatchAtomsFlow } from '@/components/atoms/manual-batch-atoms-flow';
import { CsvBatchListsFlow } from '@/components/lists/csv-batch-lists-flow';
import { ManualBatchListsFlow } from '@/components/lists/manual-batch-lists-flow';

type CreationMode = 'manual_atoms' | 'csv_atoms' | 'manual_lists' | 'csv_lists';

export function AtomCreationWorkspace() {
  const [mode, setMode] = useState<CreationMode>('manual_atoms');

  return (
    <div className="space-y-6">
      <div className="rounded-[1.15rem] border border-line/80 bg-paper/70 p-3">
        <div className="flex flex-wrap gap-2 rounded-[1.1rem] border border-line bg-white/80 p-2">
          {([
            ['manual_atoms', 'Atoms'],
            ['csv_atoms', 'CSV atoms'],
            ['manual_lists', 'Batch lists'],
            ['csv_lists', 'CSV lists'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={`rounded-full px-4 py-2 text-sm transition-colors duration-150 ${
                mode === value ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'manual_atoms' ? <ManualBatchAtomsFlow /> : null}
      {mode === 'csv_atoms' ? <CsvBatchAtomsFlow /> : null}
      {mode === 'manual_lists' ? <ManualBatchListsFlow /> : null}
      {mode === 'csv_lists' ? <CsvBatchListsFlow /> : null}
    </div>
  );
}
