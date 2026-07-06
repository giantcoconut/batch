'use client';

import { useRef, useState } from 'react';

import { useSelectedNetwork } from '@/components/app/network-provider';
import {
  normalizeImageUploadError,
  readImageFileAsBase64,
  uploadIntuitionImage,
  uploadIntuitionImageFromUrl,
  validateAtomImageFile,
} from '@/lib/intuition/images';
import type { AtomDraft, AtomSchemaType } from '@/types/atoms';

function isRichSchema(schemaType: AtomSchemaType): boolean {
  return schemaType === 'Thing' || schemaType === 'Person' || schemaType === 'Organization';
}

export function AtomDraftRowEditor({
  draft,
  index,
  disabled,
  onPatch,
  onRemove,
}: {
  draft: AtomDraft;
  index: number;
  disabled?: boolean;
  onPatch: (patch: Partial<AtomDraft>) => void;
  onRemove: () => void;
}) {
  const { network } = useSelectedNetwork();
  const [imageUploadStatus, setImageUploadStatus] = useState<'idle' | 'uploading' | 'uploaded' | 'failed'>('idle');
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null);
  const uploadTokenRef = useRef(0);

  const setSchemaType = (schemaType: AtomSchemaType) => {
    onPatch({
      schemaType,
      ...(isRichSchema(schemaType)
        ? {}
        : {
            name: '',
            description: '',
            url: '',
            image: '',
            email: '',
            identifier: '',
          }),
      ...(schemaType === 'Account'
        ? {}
        : {
            accountChainId: '1',
            accountAddress: '',
          }),
      ...(schemaType === 'Raw'
        ? {}
        : {
            rawData: '',
      }),
    });
  };

  async function handleImageFileChange(file: File | null) {
    if (!file) {
      return;
    }

    uploadTokenRef.current += 1;
    const uploadToken = uploadTokenRef.current;
    const validationError = validateAtomImageFile(file);

    if (validationError) {
      setSelectedImageName(file.name);
      setImageUploadStatus('failed');
      setImageUploadError(validationError);
      return;
    }

    setSelectedImageName(file.name);
    setImageUploadStatus('uploading');
    setImageUploadError(null);

    try {
      const data = await readImageFileAsBase64(file);
      const uploadedImage = await uploadIntuitionImage(network, {
        contentType: file.type,
        data,
        filename: file.name || 'atom-image',
      });

      if (uploadToken !== uploadTokenRef.current) {
        return;
      }

      onPatch({ image: uploadedImage.url });
      setImageUploadStatus('uploaded');
      setImageUploadError(uploadedImage.safe === false ? 'Image uploaded but marked unsafe by moderation.' : null);
    } catch (caughtError) {
      if (uploadToken !== uploadTokenRef.current) {
        return;
      }

      setImageUploadStatus('failed');
      setImageUploadError(normalizeImageUploadError(caughtError));
    }
  }

  async function handleImportImageUrl() {
    const imageUrl = draft.image.trim();

    if (!imageUrl) {
      setImageUploadStatus('failed');
      setImageUploadError('Paste a public HTTPS image URL before importing it.');
      return;
    }

    if (!imageUrl.startsWith('https://')) {
      setImageUploadStatus('failed');
      setImageUploadError('Only public HTTPS image URLs can be imported through Intuition.');
      return;
    }

    uploadTokenRef.current += 1;
    const uploadToken = uploadTokenRef.current;
    setSelectedImageName(null);
    setImageUploadStatus('uploading');
    setImageUploadError(null);

    try {
      const uploadedImage = await uploadIntuitionImageFromUrl(network, imageUrl);

      if (uploadToken !== uploadTokenRef.current) {
        return;
      }

      onPatch({ image: uploadedImage.url });
      setImageUploadStatus('uploaded');
      setImageUploadError(uploadedImage.safe === false ? 'Image imported but marked unsafe by moderation.' : null);
    } catch (caughtError) {
      if (uploadToken !== uploadTokenRef.current) {
        return;
      }

      setImageUploadStatus('failed');
      setImageUploadError(normalizeImageUploadError(caughtError));
    }
  }

  return (
    <div className="rounded-[1.15rem] border border-line/80 bg-paper/60 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.72rem] uppercase tracking-terminal text-muted">Atom {index + 1}</p>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={draft.schemaType}
            onChange={(event) => setSchemaType(event.target.value as AtomSchemaType)}
            disabled={disabled}
            className="rounded-full border border-line bg-white/80 px-3 py-2 text-sm text-ink outline-none"
          >
            {(['Thing', 'Person', 'Organization', 'Account', 'Raw'] as AtomSchemaType[]).map((schemaType) => (
              <option key={schemaType} value={schemaType}>
                {schemaType === 'Raw' ? 'Raw URI / data' : schemaType}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="inline-flex rounded-full border border-line bg-white/75 px-3 py-2 text-sm text-muted transition-colors duration-150 hover:border-ink/15 hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {isRichSchema(draft.schemaType) ? (
          <>
            <label className="space-y-2">
              <span className="text-sm text-muted">Name</span>
              <input
                value={draft.name}
                onChange={(event) => onPatch({ name: event.target.value })}
                disabled={disabled}
                className="w-full rounded-xl border border-line/80 bg-white/70 px-4 py-3 text-sm text-ink outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-muted">URL (optional)</span>
              <input
                value={draft.url}
                onChange={(event) => onPatch({ url: event.target.value })}
                disabled={disabled}
                placeholder="https://..."
                className="w-full rounded-xl border border-line/80 bg-white/70 px-4 py-3 text-sm text-ink outline-none"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm text-muted">Description</span>
              <textarea
                value={draft.description}
                onChange={(event) => onPatch({ description: event.target.value })}
                rows={3}
                disabled={disabled}
                className="w-full rounded-xl border border-line/80 bg-white/70 px-4 py-3 text-sm leading-7 text-ink outline-none"
              />
            </label>
            <div className="space-y-3 md:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-muted">Image (optional)</span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      void handleImportImageUrl();
                    }}
                    disabled={disabled || imageUploadStatus === 'uploading'}
                    className="inline-flex rounded-full border border-line bg-white/80 px-3 py-2 text-sm text-ink transition-colors duration-150 hover:border-ink/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {imageUploadStatus === 'uploading' ? 'Working...' : 'Import URL'}
                  </button>
                  <label className="inline-flex cursor-pointer rounded-full border border-line bg-white/80 px-3 py-2 text-sm text-ink transition-colors duration-150 hover:border-ink/15 disabled:cursor-not-allowed disabled:opacity-60">
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={disabled || imageUploadStatus === 'uploading'}
                      onChange={(event) => {
                        void handleImageFileChange(event.target.files?.[0] ?? null);
                        event.currentTarget.value = '';
                      }}
                    />
                    {imageUploadStatus === 'uploading' ? 'Uploading image...' : 'Upload image'}
                  </label>
                </div>
              </div>
              <input
                value={draft.image}
                onChange={(event) => {
                  onPatch({ image: event.target.value });
                  setImageUploadStatus('idle');
                  setImageUploadError(null);
                }}
                disabled={disabled}
                placeholder="https://... or ipfs://..."
                className="w-full rounded-xl border border-line/80 bg-white/70 px-4 py-3 text-sm text-ink outline-none"
              />
              <div className="space-y-1 text-sm leading-6 text-muted">
                <p>Upload your own image, or paste a public image URL and import it through Intuition.</p>
                {selectedImageName ? <p>Selected file: {selectedImageName}</p> : null}
                {imageUploadStatus === 'uploaded' && draft.image.trim() ? <p className="text-[#1f8a62]">Image uploaded and linked to this atom.</p> : null}
                {imageUploadError ? <p className="text-[#8a4b38]">{imageUploadError}</p> : null}
              </div>
            </div>
            {(draft.schemaType === 'Person' || draft.schemaType === 'Organization') ? (
              <label className="space-y-2">
                <span className="text-sm text-muted">Email (optional)</span>
                <input
                  value={draft.email}
                  onChange={(event) => onPatch({ email: event.target.value })}
                  disabled={disabled}
                  className="w-full rounded-xl border border-line/80 bg-white/70 px-4 py-3 text-sm text-ink outline-none"
                />
              </label>
            ) : null}
            {draft.schemaType === 'Person' ? (
              <label className="space-y-2">
                <span className="text-sm text-muted">Identifier (optional)</span>
                <input
                  value={draft.identifier}
                  onChange={(event) => onPatch({ identifier: event.target.value })}
                  disabled={disabled}
                  className="w-full rounded-xl border border-line/80 bg-white/70 px-4 py-3 text-sm text-ink outline-none"
                />
              </label>
            ) : null}
          </>
        ) : null}

        {draft.schemaType === 'Account' ? (
          <>
            <label className="space-y-2">
              <span className="text-sm text-muted">Account chain ID</span>
              <input
                value={draft.accountChainId}
                onChange={(event) => onPatch({ accountChainId: event.target.value })}
                disabled={disabled}
                className="w-full rounded-xl border border-line/80 bg-white/70 px-4 py-3 text-sm text-ink outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-muted">Address</span>
              <input
                value={draft.accountAddress}
                onChange={(event) => onPatch({ accountAddress: event.target.value })}
                disabled={disabled}
                placeholder="0x..."
                className="w-full rounded-xl border border-line/80 bg-white/70 px-4 py-3 font-mono text-sm text-ink outline-none"
              />
            </label>
          </>
        ) : null}

        {draft.schemaType === 'Raw' ? (
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm text-muted">Exact URI or raw data string</span>
            <textarea
              value={draft.rawData}
              onChange={(event) => onPatch({ rawData: event.target.value })}
              rows={3}
              disabled={disabled}
              className="w-full rounded-xl border border-line/80 bg-white/70 px-4 py-3 font-mono text-sm leading-7 text-ink outline-none"
            />
          </label>
        ) : null}

        <label className="space-y-2">
          <span className="text-sm text-muted">Initial support (optional)</span>
          <input
            value={draft.support}
            onChange={(event) => onPatch({ support: event.target.value })}
            disabled={disabled}
            placeholder="0"
            className="w-full rounded-xl border border-line/80 bg-white/70 px-4 py-3 text-sm text-ink outline-none"
          />
        </label>
      </div>
    </div>
  );
}
