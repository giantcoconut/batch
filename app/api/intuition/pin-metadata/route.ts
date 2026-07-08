import { NextRequest, NextResponse } from 'next/server';

import { requestIntuitionPinGraph, requestIntuitionPinThing } from '@/lib/intuition/pinning';
import type { IntuitionPinRequest } from '@/types/api';

const PIN_PERSON_MUTATION = `
  mutation PinPerson($name: String!, $description: String!, $image: String!, $url: String!, $email: String!, $identifier: String!) {
    pinPerson(person: { name: $name, description: $description, image: $image, url: $url, email: $email, identifier: $identifier }) {
      uri
    }
  }
`;

const PIN_ORGANIZATION_MUTATION = `
  mutation PinOrganization($name: String!, $description: String!, $image: String!, $url: String!, $email: String!) {
    pinOrganization(organization: { name: $name, description: $description, image: $image, url: $url, email: $email }) {
      uri
    }
  }
`;

function normalizeOptional(value: string | undefined): string {
  return value?.trim() ?? '';
}

function isValidOptionalHttpUrl(value: string): boolean {
  if (!value) {
    return true;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidOptionalImageRef(value: string): boolean {
  if (!value) {
    return true;
  }

  if (value.startsWith('ipfs://')) {
    return true;
  }

  if (/^data:image\/[a-z0-9.+-]+;base64,/i.test(value)) {
    return true;
  }

  return isValidOptionalHttpUrl(value);
}

function isValidOptionalEmail(value: string): boolean {
  if (!value) {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as IntuitionPinRequest;
  const network = body.network;

  if (network !== 'mainnet' && network !== 'testnet') {
    return NextResponse.json({ error: 'Unsupported network.' }, { status: 400 });
  }

  const name = body.name?.trim();
  const description = normalizeOptional(body.description);
  const image = normalizeOptional(body.image);
  const url = normalizeOptional(body.url);
  const email = normalizeOptional(body.email);
  const identifier = normalizeOptional(body.identifier);

  if (!name) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  }

  if (!isValidOptionalHttpUrl(url) || !isValidOptionalImageRef(image)) {
    return NextResponse.json(
      { error: 'URL must be empty or a valid HTTPS URL. Image must be empty, a valid HTTPS URL, data image, or an ipfs:// URI.' },
      { status: 400 },
    );
  }

  if (!isValidOptionalEmail(email)) {
    return NextResponse.json({ error: 'Email must be empty or valid.' }, { status: 400 });
  }

  try {
    if (body.schemaType === 'Thing') {
      const uri = await requestIntuitionPinThing({ name, description, image, url });

      if (!uri.startsWith('ipfs://')) {
        return NextResponse.json({ error: 'Pin response did not include a valid ipfs:// URI.' }, { status: 502 });
      }

      return NextResponse.json({ uri });
    }

    if (body.schemaType === 'Person') {
      const data = await requestIntuitionPinGraph<{
        pinPerson?: { uri?: string };
      }, Record<string, string>>(PIN_PERSON_MUTATION, { name, description, image, url, email, identifier });
      const uri = data.pinPerson?.uri ?? '';

      if (!uri.startsWith('ipfs://')) {
        return NextResponse.json({ error: 'Pin response did not include a valid ipfs:// URI.' }, { status: 502 });
      }

      return NextResponse.json({ uri });
    }

    const data = await requestIntuitionPinGraph<{
      pinOrganization?: { uri?: string };
    }, Record<string, string>>(PIN_ORGANIZATION_MUTATION, { name, description, image, url, email });
    const uri = data.pinOrganization?.uri ?? '';

    if (!uri.startsWith('ipfs://')) {
      return NextResponse.json({ error: 'Pin response did not include a valid ipfs:// URI.' }, { status: 502 });
    }

    return NextResponse.json({ uri });
  } catch (caughtError) {
    const message = caughtError instanceof Error ? caughtError.message : 'Pin request failed.';
    const status =
      message.includes('INTUITION_PIN_API_KEY') || message.includes('API key was rejected') ? 500 : 502;

    return NextResponse.json({ error: message }, { status });
  }
}
