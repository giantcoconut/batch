'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

import { WalletButton } from '@/components/wallet/wallet-button';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[92rem] px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/" className="text-[0.72rem] uppercase tracking-terminal text-muted">
            Intuition Batch Tool
          </Link>
          <p className="text-sm leading-6 text-muted">Community batch operations for Intuition protocol writes.</p>
        </div>
        <WalletButton />
      </header>
      {children}
    </div>
  );
}
