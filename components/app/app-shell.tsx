'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { NetworkToggle } from '@/components/app/network-toggle';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { WalletButton } from '@/components/wallet/wallet-button';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/create', label: 'Create', badge: '4' },
  { href: '/docs', label: 'Docs' },
];

export function AppShell({ children, fullBleed = false }: { children: ReactNode; fullBleed?: boolean }) {
  const pathname = usePathname();

  return (
    <div className={`mx-auto min-h-screen w-full pb-16 pt-8 sm:pt-10 ${fullBleed ? 'max-w-none px-0' : 'max-w-[92rem] px-5 sm:px-8'}`}>
      <header className={`mb-10 grid items-center gap-4 lg:grid-cols-[minmax(18rem,1fr)_auto_minmax(18rem,1fr)] ${fullBleed ? 'px-5 sm:px-8' : ''}`}>
        <div className="space-y-1 justify-self-center text-center lg:justify-self-start lg:text-left">
          <Link href="/" className="text-[0.72rem] uppercase tracking-terminal text-muted">
            Intuition Batch Tool
          </Link>
          <p className="text-sm leading-6 text-muted">Community batch operations for Intuition protocol writes.</p>
        </div>

        <nav
          aria-label="Primary navigation"
          className="inline-flex w-full max-w-xl items-center gap-1 justify-self-center rounded-full border border-line/75 bg-white/82 p-1.5 shadow-[0_18px_45px_rgba(47,34,24,0.08)] backdrop-blur sm:w-auto"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm transition-colors duration-150 sm:flex-none sm:px-5 ${
                  isActive ? 'bg-accent font-medium text-black' : 'text-ink hover:bg-paper/70'
                }`}
              >
                {item.label}
                {item.badge ? (
                  <span
                    className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs ${
                      isActive ? 'bg-black text-accent' : 'bg-paper text-muted'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-line/70 bg-white/60 p-1.5 lg:justify-self-end">
          <NetworkToggle compact />
          <ThemeToggle />
          <WalletButton />
        </div>
      </header>
      {children}
    </div>
  );
}
