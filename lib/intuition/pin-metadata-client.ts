import type { IntuitionPinRequest } from '@/types/api';

export async function pinRichMetadata(request: IntuitionPinRequest): Promise<string> {
  const response = await fetch('/api/intuition/pin-metadata', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  const payload = (await response.json()) as { uri?: string; error?: string };

  if (!response.ok || !payload.uri) {
    throw new Error(payload.error ?? 'Failed to pin atom metadata to IPFS.');
  }

  return payload.uri;
}
