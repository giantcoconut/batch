import Link from 'next/link';

import { AppShell } from '@/components/app/app-shell';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <AppShell>
      <section className="space-y-6">
        <div className="space-y-3">
          <p className="text-[0.72rem] uppercase tracking-terminal text-muted">Intuition Batch Tool</p>
          <h1 className="max-w-4xl font-serif text-5xl leading-[0.92] tracking-[-0.055em] sm:text-7xl">
            Review first. Publish Intuition batch operations with confidence.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-muted sm:text-lg">
            This standalone community app supports manual atoms, CSV atoms, manual lists, and CSV lists today, with
            explicit review states before any write is sent.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/create"
            className="inline-flex rounded-full border border-ink bg-ink px-5 py-3 text-sm text-paper transition-colors duration-150 hover:bg-[#3a2a23]"
          >
            Open batch workspace
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
