import { AppShell } from '@/components/app/app-shell';
import { AtomCreationWorkspace } from '@/components/atoms/atom-creation-workspace';
import { SessionSidebar } from '@/components/app/session-sidebar';

export const dynamic = 'force-dynamic';

export default function CreatePage() {
  return (
    <AppShell>
      <div className="grid gap-8 xl:grid-cols-[18rem_minmax(0,1fr)] xl:items-start">
        <SessionSidebar />
        <section className="space-y-6">
          <AtomCreationWorkspace />
        </section>
      </div>
    </AppShell>
  );
}
