import { PIN_API_URL, requestPinThing as requestOfficialPinThing, type PinThingMutationVariables } from '@0xintuition/graphql';

export const INTUITION_PIN_API_URL = PIN_API_URL;

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
