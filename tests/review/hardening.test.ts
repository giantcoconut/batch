import test from 'node:test';
import assert from 'node:assert/strict';

import { buildAtomReviewRows } from '@/lib/intuition/atom-duplicates';
import { reviewCsvBatchLists } from '@/lib/intuition/csv-batch-lists';
import { getCreatablePreparedAtoms, publishManualBatchAtoms } from '@/lib/intuition/manual-batch-atoms';
import { getCreatablePreparedListEntries, publishManualBatchLists } from '@/lib/intuition/manual-batch-lists';
import { prepareCreateAtomsTransaction, prepareCreateTriplesTransaction } from '@/lib/intuition/tx-prepare';
import { getPublishDisabledReason } from '@/lib/utils/publish-state';
import type { IntuitionAtomSearchResult } from '@/types/api';
import type { AtomDraft, AtomReviewRow, PreparedAtomDraft } from '@/types/atoms';
import type { CsvListParseRow, ManualListReviewRow, PreparedListEntry } from '@/types/lists';

const listAtom: IntuitionAtomSearchResult = {
  termId: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  label: 'Layer One List',
  type: 'Thing',
  data: null,
  description: null,
  image: null,
  url: null,
  creatorId: null,
  creatorLabel: null,
  positionCount: 0,
  totalShares: '0',
};

test('buildAtomReviewRows uses skip_existing when an explicit existing match is provided', () => {
  const drafts: AtomDraft[] = [
    {
      id: 'a1',
      schemaType: 'Raw',
      name: '',
      description: '',
      url: '',
      image: '',
      email: '',
      identifier: '',
      accountChainId: '1',
      accountAddress: '',
      rawData: 'alpha',
      support: '',
    },
  ];

  const prepared: PreparedAtomDraft[] = [
    { id: 'a1', displayName: 'alpha', dataString: 'alpha', atomId: '0x01', assetWei: 1n, supportWei: 0n, existsOnChain: true },
  ];

  const rows = buildAtomReviewRows(drafts, prepared, new Map([['a1', listAtom]]));

  assert.equal(rows[0]?.status, 'skip_existing');
  assert.match(rows[0]?.message ?? '', /will be skipped/i);
});

test('reviewCsvBatchLists marks ambiguous and missing rows without needing chain reads', async () => {
  const parsedRows: CsvListParseRow[] = [
    {
      row: {
        id: 'm1',
        sourceLine: 2,
        memberName: 'Alpha',
        memberDescription: '',
        selectedAtom: null,
        candidates: [
          { ...listAtom, termId: '0x1111111111111111111111111111111111111111111111111111111111111111', label: 'Alpha' },
          { ...listAtom, termId: '0x1212121212121212121212121212121212121212121212121212121212121212', label: 'Alpha Protocol' },
        ],
      },
      errors: [],
    },
    {
      row: {
        id: 'm2',
        sourceLine: 3,
        memberName: 'Missing',
        memberDescription: '',
        selectedAtom: null,
        candidates: [],
      },
      errors: [],
    },
  ];

  const publicClient = {
    readContract: async () => {
      throw new Error('readContract should not be called for unresolved rows');
    },
  } as never;

  const rows = await reviewCsvBatchLists({
    listAtom,
    parsedRows,
    network: 'testnet',
    publicClient,
  });

  assert.equal(rows[0]?.status, 'ambiguous');
  assert.equal(rows[1]?.status, 'missing');
});

test('getCreatablePreparedAtoms only returns ready atom rows', () => {
  const preparedAtom: PreparedAtomDraft = {
    id: 'a1',
    displayName: 'alpha',
    dataString: 'alpha',
    atomId: '0x0101010101010101010101010101010101010101010101010101010101010101',
    assetWei: 2n,
    supportWei: 0n,
    existsOnChain: false,
  };
  const rows: AtomReviewRow[] = [
    { id: 'a1', label: 'alpha', status: 'ready_to_create', message: 'ready', payload: { draft: {} as AtomDraft, prepared: preparedAtom } },
    { id: 'a2', label: 'beta', status: 'existing', message: 'skip', payload: { draft: {} as AtomDraft } },
  ];

  assert.deepEqual(getCreatablePreparedAtoms(rows), [preparedAtom]);
});

test('getCreatablePreparedListEntries only returns ready list rows', () => {
  const preparedEntry: PreparedListEntry = {
    id: 'm1',
    listTermId: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    memberTermId: '0x1111111111111111111111111111111111111111111111111111111111111111',
    tripleId: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    assetWei: 3n,
    alreadyExistsOnChain: false,
  };
  const rows: ManualListReviewRow[] = [
    { id: 'm1', label: 'Alpha', status: 'ready_to_create', message: 'ready', payload: { row: {} as never, prepared: preparedEntry } },
    { id: 'm2', label: 'Beta', status: 'skip_existing', message: 'skip', payload: { row: {} as never } },
  ];

  assert.deepEqual(getCreatablePreparedListEntries(rows), [preparedEntry]);
});

test('prepareCreateAtomsTransaction includes only eligible atom payload assets', () => {
  const prepared = prepareCreateAtomsTransaction([
    {
      id: 'a1',
      displayName: 'alpha',
      dataString: 'alpha',
      atomId: '0x0101010101010101010101010101010101010101010101010101010101010101',
      assetWei: 2n,
      supportWei: 0n,
      existsOnChain: false,
    },
    {
      id: 'a2',
      displayName: 'beta',
      dataString: 'beta',
      atomId: '0x0202020202020202020202020202020202020202020202020202020202020202',
      assetWei: 5n,
      supportWei: 0n,
      existsOnChain: false,
    },
  ]);

  assert.equal(prepared.value, 7n);
});

test('prepareCreateTriplesTransaction includes only eligible list entry assets', () => {
  const prepared = prepareCreateTriplesTransaction([
    {
      id: 'm1',
      listTermId: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      memberTermId: '0x1111111111111111111111111111111111111111111111111111111111111111',
      tripleId: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      assetWei: 3n,
      alreadyExistsOnChain: false,
    },
    {
      id: 'm2',
      listTermId: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      memberTermId: '0x1212121212121212121212121212121212121212121212121212121212121212',
      tripleId: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      assetWei: 4n,
      alreadyExistsOnChain: false,
    },
  ]);

  assert.equal(prepared.value, 7n);
});

test('getPublishDisabledReason explains zero eligible rows clearly', () => {
  const reason = getPublishDisabledReason({
    hasReview: true,
    eligibleCount: 0,
    walletReady: true,
    hasNetworkMismatch: false,
    networkName: 'Intuition Testnet',
    isBusy: false,
    subjectLabel: 'CSV list',
  });

  assert.match(reason ?? '', /no csv list rows are eligible/i);
});

test('getPublishDisabledReason explains wallet and network blockers clearly', () => {
  const noWallet = getPublishDisabledReason({
    hasReview: true,
    eligibleCount: 1,
    walletReady: false,
    hasNetworkMismatch: false,
    networkName: 'Intuition Testnet',
    isBusy: false,
    subjectLabel: 'atom',
  });
  const wrongNetwork = getPublishDisabledReason({
    hasReview: true,
    eligibleCount: 1,
    walletReady: true,
    hasNetworkMismatch: true,
    networkName: 'Intuition Mainnet',
    isBusy: false,
    subjectLabel: 'list entry',
  });

  assert.match(noWallet ?? '', /connect a wallet/i);
  assert.match(wrongNetwork ?? '', /switch your wallet/i);
});

test('publishManualBatchAtoms returns no_write_needed when no atoms are eligible', async () => {
  const result = await publishManualBatchAtoms({
    atoms: [],
    network: 'testnet',
    publicClient: {} as never,
    walletClient: {} as never,
    walletAddress: '0x1234' as never,
  });

  assert.equal(result.kind, 'no_write_needed');
});

test('publishManualBatchLists returns no_write_needed when no list entries are eligible', async () => {
  const result = await publishManualBatchLists({
    entries: [],
    network: 'testnet',
    publicClient: {} as never,
    walletClient: {} as never,
    walletAddress: '0x1234' as never,
  });

  assert.equal(result.kind, 'no_write_needed');
});

test('publish helpers surface transaction failures', async () => {
  const publicClient = {
    waitForTransactionReceipt: async () => ({ status: 'success' }),
  } as never;
  const walletClient = {
    sendTransaction: async () => {
      throw new Error('User rejected request');
    },
  } as never;

  await assert.rejects(
    () =>
      publishManualBatchAtoms({
        atoms: [{ id: 'a1', displayName: 'alpha', dataString: 'alpha', atomId: '0x01', assetWei: 1n, supportWei: 0n, existsOnChain: false }],
        network: 'testnet',
        publicClient,
        walletClient,
        walletAddress: '0x1111111111111111111111111111111111111111',
      }),
    /User rejected request/,
  );

  await assert.rejects(
    () =>
      publishManualBatchLists({
        entries: [
          {
            id: 'm1',
            listTermId: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            memberTermId: '0x1111111111111111111111111111111111111111111111111111111111111111',
            tripleId: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
            assetWei: 1n,
            alreadyExistsOnChain: false,
          },
        ],
        network: 'testnet',
        publicClient,
        walletClient,
        walletAddress: '0x1111111111111111111111111111111111111111',
      }),
    /User rejected request/,
  );
});
