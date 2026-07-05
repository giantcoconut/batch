import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { WalletProvider } from '@/components/wallet/wallet-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Intuition Batch Tool',
  description: 'Batch create atoms and publish list entries on Intuition.',
  applicationName: 'Intuition Batch Tool',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
