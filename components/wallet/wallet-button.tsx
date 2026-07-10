'use client';

import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

import { useEnsProfile } from '@/components/wallet/use-ens-profile';
import { WalletIdentityAvatar } from '@/components/wallet/wallet-identity-avatar';
import { formatAddress } from '@/lib/utils/format';

export function WalletButton() {
  const { address, status } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { data: ensProfile } = useEnsProfile(address);

  if (status === 'connected' && address) {
    return (
      <button
        type="button"
        onClick={openAccountModal ?? undefined}
        title={address}
        aria-label={`Wallet ${ensProfile?.name ?? formatAddress(address)}`}
        className="inline-flex items-center gap-2 rounded-full border border-[#1f8a62]/20 bg-[#1f8a62]/8 py-1.5 pl-1.5 pr-4 text-sm text-[#1f8a62] transition-colors duration-150 hover:border-[#1f8a62]/40 hover:bg-[#1f8a62]/12"
      >
        <WalletIdentityAvatar address={address} size={28} />
        <span>{ensProfile?.name ?? formatAddress(address)}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openConnectModal ?? undefined}
      className="inline-flex rounded-full border border-ink px-4 py-2 text-sm text-ink transition-colors duration-150 hover:bg-ink hover:text-paper"
    >
      {status === 'connecting' ? 'Connecting wallet...' : 'Connect wallet'}
    </button>
  );
}
