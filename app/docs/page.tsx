import { AppShell } from '@/components/app/app-shell';
import { DocsPageContent } from '@/components/docs/docs-page-content';

export const dynamic = 'force-dynamic';

export default function DocsPage() {
  return (
    <AppShell fullBleed>
      <DocsPageContent />
    </AppShell>
  );
}
