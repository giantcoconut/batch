import { PIN_API_URL, requestPinThing as requestOfficialPinThing, type PinThingMutationVariables } from '@0xintuition/graphql';

export const INTUITION_PIN_API_URL = PIN_API_URL;

export function getIntuitionPinApiKey(): string {
  const apiKey = process.env.INTUITION_PIN_API_KEY?.trim();

  if (!apiKey) {
    throw new Error('Missing INTUITION_PIN_API_KEY environment variable.');
  }

  return apiKey;
}

export async function requestIntuitionPinGraphRaw<TData, TVariables extends Record<string, unknown>>(
  query: string,
  variables: TVariables,
  signal?: AbortSignal,
): Promise<TData> {
  const requestInit: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: getIntuitionPinApiKey(),
    },
    body: JSON.stringify({ query, variables }),
  };

  if (signal) {
    requestInit.signal = signal;
  }

  const response = await fetch(INTUITION_PIN_API_URL, requestInit);

  const payload = (await response.json().catch(() => null)) as {
    data?: TData;
    errors?: Array<{ message?: string }>;
    error?: string;
    message?: string;
  } | null;

  if (!response.ok || payload?.errors?.length || !payload?.data) {
    const message =
      payload?.errors?.map((error) => error.message).filter(Boolean).join(' | ') ||
      payload?.error ||
      payload?.message ||
      `Pinning request failed with HTTP ${response.status}.`;

    throw new Error(message);
  }

  return payload.data;
}

export async function requestIntuitionPinGraph<TData, TVariables extends Record<string, unknown>>(
  query: string,
  variables: TVariables,
  signal?: AbortSignal,
): Promise<TData> {
  const { executeGraphQLRequest } = await import('@0xintuition/graphql');

  if (signal?.aborted) {
    throw new DOMException('Request aborted.', 'AbortError');
  }

  try {
    return await executeGraphQLRequest<TData, TVariables>(query, variables, undefined, {
      pinApiKey: getIntuitionPinApiKey(),
      pinApiUrl: INTUITION_PIN_API_URL,
    });
  } catch (caughtError) {
    const message = caughtError instanceof Error ? caughtError.message : 'Unknown pinning error.';

    if (message.includes('pinApiKey') || message.includes('apikey') || message.includes('401') || message.includes('403')) {
      throw new Error('Intuition pin API key was rejected.');
    }

    throw new Error(message);
  }
}

export async function requestIntuitionPinThing(variables: PinThingMutationVariables): Promise<string> {
  try {
    return await requestOfficialPinThing(variables, {
      pinApiKey: getIntuitionPinApiKey(),
      pinApiUrl: INTUITION_PIN_API_URL,
    });
  } catch (caughtError) {
    const message = caughtError instanceof Error ? caughtError.message : 'Unknown pinning error.';

    if (message.includes('pinApiKey') || message.includes('apikey') || message.includes('401') || message.includes('403')) {
      throw new Error('Intuition pin API key was rejected.');
    }

    throw new Error(message);
  }
}
