import { getAddress, stringToHex, type Hex, type PublicClient } from 'viem';

import { MULTIVAULT_ABI } from '@/lib/intuition/abi';
import { getIntuitionNetwork } from '@/lib/intuition/networks';
import {
  parseOptionalSupport,
  isValidAccountAddress,
  isValidOptionalEmail,
  isValidOptionalHttpsUrl,
  isValidOptionalImageUrl,
  isValidPositiveIntegerString,
} from '@/lib/utils/validation';
import type { IntuitionPinRequest, PublicIntuitionNetwork } from '@/types/api';
import type { AtomDraft, AtomSchemaType, PreparedAtomDraft } from '@/types/atoms';

export function createEmptyAtomDraft(id: string): AtomDraft {
  return {
    id,
    schemaType: 'Thing',
    name: '',
    description: '',
    url: '',
    image: '',
    email: '',
    identifier: '',
    accountChainId: '1',
    accountAddress: '',
    rawData: '',
    support: '',
  };
}

export function isRichAtomSchemaType(schemaType: AtomSchemaType): boolean {
  return schemaType === 'Thing' || schemaType === 'Person' || schemaType === 'Organization';
}

export function getAtomDisplayName(draft: AtomDraft): string {
  if (draft.schemaType === 'Account') {
    return draft.accountAddress.trim();
  }

  if (draft.schemaType === 'Raw') {
    return draft.rawData.trim();
  }

  return draft.name.trim();
}

export function getAtomDataString(draft: AtomDraft): string {
  if (draft.schemaType === 'Account') {
    const normalizedAddress = getAddress(draft.accountAddress.trim());
    return `caip10:eip155:${Number.parseInt(draft.accountChainId.trim(), 10)}:${normalizedAddress}`;
  }

  if (draft.schemaType === 'Raw') {
    return draft.rawData.trim();
  }

  throw new Error('Rich atom data string is created after pinning metadata.');
}

export function buildRichPinRequest(network: PublicIntuitionNetwork, draft: AtomDraft): IntuitionPinRequest {
  return {
    network,
    schemaType: draft.schemaType === 'Thing' || draft.schemaType === 'Person' || draft.schemaType === 'Organization' ? draft.schemaType : 'Thing',
    name: draft.name.trim(),
    description: draft.description.trim(),
    image: draft.image.trim(),
    url: draft.url.trim(),
    email: draft.email.trim(),
    identifier: draft.identifier.trim(),
  };
}

export function validateAtomDraft(draft: AtomDraft): string[] {
  const errors: string[] = [];

  if (isRichAtomSchemaType(draft.schemaType) && !draft.name.trim()) {
    errors.push('Name is required.');
  }

  if (!isValidOptionalHttpsUrl(draft.url)) {
    errors.push('URL must be empty or a valid HTTPS URL.');
  }

  if (!isValidOptionalImageUrl(draft.image)) {
    errors.push('Image must be empty or a valid image URL or IPFS reference.');
  }

  if (!isValidOptionalEmail(draft.email)) {
    errors.push('Email must be empty or valid.');
  }

  if (draft.schemaType === 'Account') {
    if (!isValidPositiveIntegerString(draft.accountChainId)) {
      errors.push('Account chain ID must be a positive number.');
    }

    if (!isValidAccountAddress(draft.accountAddress)) {
      errors.push('Account address must be a valid EVM address.');
    }
  }

  if (draft.schemaType === 'Raw' && !draft.rawData.trim()) {
    errors.push('Raw URI or data value is required.');
  }

  if (parseOptionalSupport(draft.support) === null) {
    errors.push('Initial support must be a valid non-negative TRUST amount.');
  }

  return errors;
}

export async function prepareAtomDraft(
  draft: AtomDraft,
  network: PublicIntuitionNetwork,
  publicClient: PublicClient,
  pinRichMetadata?: (request: IntuitionPinRequest) => Promise<string>,
): Promise<PreparedAtomDraft> {
  let dataString = '';

  if (isRichAtomSchemaType(draft.schemaType)) {
    if (!pinRichMetadata) {
      throw new Error('Rich atom preparation requires a metadata pinning function.');
    }

    dataString = await pinRichMetadata(buildRichPinRequest(network, draft));
  } else {
    dataString = getAtomDataString(draft);
  }

  const atomId = (await publicClient.readContract({
    address: getIntuitionNetwork(network).multiVault,
    abi: MULTIVAULT_ABI,
    functionName: 'calculateAtomId',
    args: [stringToHex(dataString)],
  })) as Hex;

  const existsOnChain = (await publicClient.readContract({
    address: getIntuitionNetwork(network).multiVault,
    abi: MULTIVAULT_ABI,
    functionName: 'isTermCreated',
    args: [atomId],
  })) as boolean;

  const atomCost = (await publicClient.readContract({
    address: getIntuitionNetwork(network).multiVault,
    abi: MULTIVAULT_ABI,
    functionName: 'getAtomCost',
  })) as bigint;

  const supportWei = parseOptionalSupport(draft.support) ?? 0n;

  return {
    id: draft.id,
    displayName: getAtomDisplayName(draft),
    dataString,
    atomId,
    assetWei: atomCost + supportWei,
    supportWei,
    existsOnChain,
  };
}
