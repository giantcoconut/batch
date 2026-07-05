import type { IntuitionImageUploadInput, IntuitionUploadedImage, PublicIntuitionNetwork } from '@/types/api';

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export function resolveIntuitionImageUrl(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  const raw = value.trim().replace(/^['"]|['"]$/g, '');

  if (!raw) {
    return null;
  }

  if (raw.startsWith('https://') || raw.startsWith('http://') || raw.startsWith('data:') || raw.startsWith('blob:')) {
    return raw;
  }

  if (raw.startsWith('ipfs://ipfs/')) {
    return `https://ipfs.io/${raw.slice('ipfs://'.length)}`;
  }

  if (raw.startsWith('ipfs://')) {
    return `https://ipfs.io/ipfs/${raw.slice('ipfs://'.length)}`;
  }

  if (raw.startsWith('/ipfs/')) {
    return `https://ipfs.io${raw}`;
  }

  return null;
}

export function getImagePreviewCandidates(value?: string | null): string[] {
  if (!value) {
    return [];
  }

  const raw = value.trim().replace(/^['"]|['"]$/g, '');

  if (!raw) {
    return [];
  }

  if (raw.startsWith('https://') || raw.startsWith('http://') || raw.startsWith('data:') || raw.startsWith('blob:')) {
    return [raw];
  }

  if (raw.startsWith('ipfs://ipfs/')) {
    const path = raw.slice('ipfs://'.length);
    return [`https://ipfs.io/${path}`, `https://dweb.link/${path}`];
  }

  if (raw.startsWith('ipfs://')) {
    const cidPath = raw.slice('ipfs://'.length);
    return [`https://ipfs.io/ipfs/${cidPath}`, `https://dweb.link/ipfs/${cidPath}`];
  }

  if (raw.startsWith('/ipfs/')) {
    return [`https://ipfs.io${raw}`, `https://dweb.link${raw}`];
  }

  return [];
}

export function validateAtomImageFile(file: File): string | null {
  if (!file.type.startsWith('image/')) {
    return 'Only image files are supported.';
  }

  if (file.size <= 0) {
    return 'Upload failed. The image file is empty.';
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return 'Image must be 5MB or smaller.';
  }

  return null;
}

export async function uploadIntuitionImage(
  network: PublicIntuitionNetwork,
  image: IntuitionImageUploadInput,
  signal?: AbortSignal,
): Promise<IntuitionUploadedImage> {
  const requestInit: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ network, image }),
    cache: 'no-store',
  };

  if (signal) {
    requestInit.signal = signal;
  }

  const response = await fetch('/api/intuition/upload-image', requestInit);
  const payload = (await response.json()) as IntuitionUploadedImage & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? `Upload failed with HTTP ${response.status}.`);
  }

  if (!payload.url || (!payload.url.startsWith('https://') && !payload.url.startsWith('ipfs://'))) {
    throw new Error('Upload failed.');
  }

  return payload.safe === undefined ? { url: payload.url } : { url: payload.url, safe: payload.safe };
}
