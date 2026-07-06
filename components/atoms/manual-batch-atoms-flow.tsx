'use client';

import { useMemo, useState } from 'react';
import { getAddress, type Hex } from 'viem';
import { useAccount, useChainId, useWalletClient } from 'wagmi';

import { useSelectedNetwork } from '@/components/app/network-provider';
import { AtomDraftRowEditor } from '@/components/atoms/atom-draft-row-editor';
import { AtomReviewTable } from '@/components/atoms/atom-review-table';
import { createIntuitionPublicClient } from '@/lib/intuition/public-client';
import { createEmptyAtomDraft } from '@/lib/intuition/atom-prepare';
import { getCreatablePreparedAtoms, publishManualBatchAtoms, reviewManualBatchAtoms } from '@/lib/intuition/manual-batch-atoms';
import { getIntuitionNetwork, getIntuitionNetworkByChainId } from '@/lib/intuition/networks';
import { createLocalId } from '@/lib/utils/ids';
import { getPublishDisabledReason } from '@/lib/utils/publish-state';
import type { AtomDraft, ManualAtomReviewRow } from '@/types/atoms';
import type { WriteResult } from '@/types/writes';

function createDraft(seed = ''): AtomDraft {
  return {
    ...createEmptyAtomDraft(createLocalId('atom')),
    name: seed,
  };
}

export function ManualBatchAtomsFlow() {
  const { address, status: accountStatus } = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();
  const { network } = useSelectedNetwork();

  const [drafts, setDrafts] = useState<AtomDraft[]>([createDraft()]);
  const [reviewRows, setReviewRows] = useState<ManualAtomReviewRow[] | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [writeResult, setWriteResult] = useState<WriteResult | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const networkConfig = getIntuitionNetwork(network);
  const publicClient = useMemo(() => createIntuitionPublicClient(network), [network]);
  const walletNetworkConfig = getIntuitionNetworkByChainId(chainId ?? null);
  const walletReady = accountStatus === 'connected' && !!address;
  const canWrite = walletReady && walletNetworkConfig?.key === network;
  const hasNetworkMismatch = walletReady && walletNetworkConfig !== null && walletNetworkConfig?.key !== network;

  const creatableAtoms = useMemo(() => (reviewRows ? getCreatablePreparedAtoms(reviewRows) : []), [reviewRows]);
  const isSingleDraftMode = drafts.length === 1;
  const hasSingleEligibleAtom = creatableAtoms.length === 1;
  const publishDisabledReason = getPublishDisabledReason({
    hasReview: !!reviewRows,
    eligibleCount: creatableAtoms.length,
    walletReady,
    hasNetworkMismatch,
    networkName: networkConfig.name,
    isBusy: isReviewing || isPublishing,
    subjectLabel: 'atom',
  });

  function patchDraft(id: string, patch: Partial<AtomDraft>) {
    setDrafts((current) => current.map((draft) => (draft.id === id ? { ...draft, ...patch } : draft)));
    setReviewRows(null);
    setStatus(null);
    setError(null);
    setWriteResult(null);
  }

  function addDraft() {
    setDrafts((current) => [...current, createDraft()]);
    setReviewRows(null);
    setStatus(null);
    setError(null);
    setWriteResult(null);
  }

  function removeDraft(id: string) {
    setDrafts((current) => (current.length > 1 ? current.filter((draft) => draft.id !== id) : current));
    setReviewRows(null);
    setStatus(null);
    setError(null);
    setWriteResult(null);
  }

  async function handleReview() {
    setIsReviewing(true);
    setError(null);
    setWriteResult(null);
    setStatus('Validating drafts and preparing atom review...');

    try {
      const nextRows = await reviewManualBatchAtoms({
        drafts,
        network,
        publicClient,
      });

      setReviewRows(nextRows);
      setStatus(`Review ready. ${nextRows.filter((row) => row.status === 'ready_to_create').length} atoms can be created.`);
    } catch (caughtError) {
      setReviewRows(null);
      setStatus(null);
      setError(caughtError instanceof Error ? `Atom batch review failed: ${caughtError.message}` : 'Atom batch review failed.');
    } finally {
      setIsReviewing(false);
    }
  }

  async function handlePublish() {
    if (!reviewRows || creatableAtoms.length === 0) {
      setError('Review the batch before publishing.');
      return;
    }

    if (!canWrite || !walletClient || !address) {
      setError(`Connect a wallet on ${networkConfig.name} before publishing the batch.`);
      return;
    }

    setIsPublishing(true);
    setError(null);
    setStatus('Waiting for wallet approval to create the eligible atoms...');
    setWriteResult(null);

    try {
      const result = await publishManualBatchAtoms({
        atoms: creatableAtoms,
        network,
        publicClient,
        walletClient,
        walletAddress: getAddress(address) as Hex,
      });

      setWriteResult(result);
      setStatus(`Batch confirmed. ${result.createdIds.length} atoms were created on ${networkConfig.name}.`);
    } catch (caughtError) {
      setStatus(null);
      setError(caughtError instanceof Error ? `Atom batch publish failed: ${caughtError.message}` : 'Atom batch publish failed.');
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="border border-line/80 bg-white/70 p-8 shadow-sheet">
        <div className="space-y-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <p className="text-[0.72rem] uppercase tracking-terminal text-muted">Manual atoms</p>
              <h1 className="font-serif text-[2.6rem] leading-none tracking-[-0.05em] sm:text-[3.3rem]">
                Create one atom fast, or build a reviewed batch when you need it.
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-muted">
                Start with a single atom draft for the common case, then add more rows whenever you want batch review,
                duplicate detection, and one `createAtoms` transaction for every eligible atom.
              </p>
            </div>

          </div>

          <div className="space-y-4">
            {drafts.map((draft, index) => (
              <AtomDraftRowEditor
                key={draft.id}
                draft={draft}
                index={index}
                disabled={isReviewing || isPublishing}
                onPatch={(patch) => patchDraft(draft.id, patch)}
                onRemove={() => removeDraft(draft.id)}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={addDraft}
              disabled={isReviewing || isPublishing}
              className="inline-flex rounded-full border border-ink bg-ink px-4 py-2 text-sm text-paper transition-colors duration-150 hover:bg-[#3a2a23] disabled:cursor-not-allowed disabled:opacity-60"
            >
              + Add atom
            </button>
            <button
              type="button"
              onClick={() => {
                void handleReview();
              }}
              disabled={isReviewing || isPublishing}
              className="inline-flex rounded-full border border-line bg-paper/70 px-4 py-2 text-sm text-muted transition-colors duration-150 hover:border-ink/15 hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isReviewing ? `Reviewing ${isSingleDraftMode ? 'atom' : 'batch'}...` : `Review ${isSingleDraftMode ? 'atom' : 'batch'}`}
            </button>
          </div>

          {reviewRows ? <AtomReviewTable rows={reviewRows} nativeSymbol={networkConfig.nativeSymbol} /> : null}

          <div className="rounded-[1.15rem] border border-line/80 bg-paper/70 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-[0.72rem] uppercase tracking-terminal text-muted">Publish</p>
                <p className="text-sm leading-7 text-muted">
                  Only rows marked `ready_to_create` are included in the transaction.
                </p>
                <p className="text-sm leading-7 text-muted">
                  Eligible {isSingleDraftMode ? 'atoms' : 'rows'}: <span className="text-ink">{creatableAtoms.length}</span> /{' '}
                  {reviewRows?.length ?? 0}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  void handlePublish();
                }}
                disabled={!reviewRows || creatableAtoms.length === 0 || !canWrite || isPublishing || isReviewing}
                className="inline-flex rounded-full border border-ink px-5 py-3 text-sm text-ink transition-colors duration-150 hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPublishing
                  ? `Publishing ${hasSingleEligibleAtom ? 'atom' : 'batch'}...`
                  : hasNetworkMismatch
                    ? 'Wrong network'
                    : `Publish eligible ${hasSingleEligibleAtom ? 'atom' : 'atoms'}`}
              </button>
            </div>

            {publishDisabledReason ? <p className="mt-4 text-sm leading-7 text-muted">{publishDisabledReason}</p> : null}

            {status ? <p className="mt-4 text-sm leading-7 text-muted">{status}</p> : null}
            {error ? <p className="mt-4 text-sm leading-7 text-[#8a4b38]">{error}</p> : null}

            {writeResult?.txHash ? (
              <div className="mt-4 rounded-xl border border-line/80 bg-white/75 p-4">
                <p className="text-[0.68rem] uppercase tracking-terminal text-muted">Transaction</p>
                <a
                  href={`${networkConfig.explorerUrl}/tx/${writeResult.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex break-all font-mono text-[0.78rem] leading-6 text-ink underline decoration-line underline-offset-4"
                >
                  {writeResult.txHash}
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
