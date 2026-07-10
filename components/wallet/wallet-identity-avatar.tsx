'use client';

import { useEffect, useState } from 'react';
import type { Address } from 'viem';

import { useEnsProfile } from '@/components/wallet/use-ens-profile';

export function WalletIdentityAvatar({
  address,
  ensImage,
  size,
}: {
  address: Address;
  ensImage?: string | null | undefined;
  size: number;
}) {
  const { data: ensProfile } = useEnsProfile(address);
  const image = ensImage || ensProfile?.avatar || null;
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [image]);

  if (image && !imageFailed) {
    return (
      <img
        src={image}
        alt=""
        width={size}
        height={size}
        className="shrink-0 rounded-full object-cover"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-accentSoft text-ink"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span style={{ fontSize: Math.max(10, Math.floor(size * 0.36)), lineHeight: 1 }}>
        {address.slice(2, 4).toUpperCase()}
      </span>
    </span>
  );
}
