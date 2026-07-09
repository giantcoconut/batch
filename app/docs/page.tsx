import { AppShell } from '@/components/app/app-shell';

export const dynamic = 'force-dynamic';

export default function DocsPage() {
  return (
    <AppShell>
      <section className="rounded-[1.5rem] border border-line/80 bg-white/70 p-8 shadow-sheet">
        <div className="space-y-4">
          <p className="text-[0.72rem] uppercase tracking-terminal text-muted">Docs</p>
          <h1 className="max-w-4xl font-serif text-5xl leading-[0.92] tracking-[-0.055em] sm:text-6xl">
            Operator notes for safer batch publishing.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-muted">
            This section will hold CSV formats, review-state explanations, wallet/network setup, and community testing
            notes. For now, use the Create tab to access the live atom and list workflows.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ['CSV formats', 'Sample atom and list templates, supported headers, and validation notes.'],
            ['Review states', 'What ready, skipped, duplicate, ambiguous, missing, and invalid rows mean.'],
            ['Publishing', 'Wallet, network, pinning, and transaction checks before sending writes.'],
          ].map(([title, description]) => (
            <div key={title} className="rounded-[1.15rem] border border-line/80 bg-paper/65 p-5">
              <p className="text-[0.72rem] uppercase tracking-terminal text-muted">{title}</p>
              <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
