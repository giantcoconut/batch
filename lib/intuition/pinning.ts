export const INTUITION_PIN_API_URL = 'https://pin.intuition.systems/v1/graphql';

interface IntuitionPinGraphResponse<TData> {
  data?: TData;
  errors?: Array<{ message?: string }>;
}

function getIntuitionPinApiKey(): string {
  const apiKey = process.env.INTUITION_PIN_API_KEY?.trim();

  if (!apiKey) {
    throw new Error('Missing INTUITION_PIN_API_KEY environment variable.');
  }

  return apiKey;
}

export async function requestIntuitionPinGraph<TData, TVariables extends Record<string, unknown>>(
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
    cache: 'no-store',
  };

  if (signal) {
    requestInit.signal = signal;
  }

  const response = await fetch(INTUITION_PIN_API_URL, requestInit);

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Intuition pin API key was rejected.');
    }

    throw new Error(`Intuition pin request failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as IntuitionPinGraphResponse<TData>;

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message ?? 'Unknown pinning error.').join('; '));
  }

  if (!payload.data) {
    throw new Error('Intuition pin request returned no data.');
  }

  return payload.data;
}
