import { AppShell } from '@/components/app/app-shell';
import { SessionSidebar } from '@/components/app/session-sidebar';

export default function CreatePage() {
  return (
    <AppShell>
      <div className="grid gap-8 xl:grid-cols-[18rem_minmax(0,1fr)] xl:items-start">
        <SessionSidebar />
        <section className="space-y-6">
          <div className="border border-line/80 bg-white/70 p-8 shadow-sheet">
            <div className="space-y-4">
              <p className="text-[0.72rem] uppercase tracking-terminal text-muted">Foundation</p>
              <h1 className="font-serif text-[2.6rem] leading-none tracking-[-0.05em] sm:text-[3.3rem]">
                App shell is ready for the batch flows.
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-muted">
                This page proves the standalone app boots with wallet wiring, Intuition network configuration, neutral
                metadata, and the extracted protocol modules in place. The full manual and CSV flows land in the next
                implementation pass.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
