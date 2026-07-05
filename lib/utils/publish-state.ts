export function getPublishDisabledReason({
  hasReview,
  eligibleCount,
  walletReady,
  hasNetworkMismatch,
  networkName,
  isBusy,
  subjectLabel,
}: {
  hasReview: boolean;
  eligibleCount: number;
  walletReady: boolean;
  hasNetworkMismatch: boolean;
  networkName: string;
  isBusy: boolean;
  subjectLabel: string;
}): string | null {
  if (isBusy) {
    return `Finish the current ${subjectLabel} action before publishing.`;
  }

  if (!hasReview) {
    return `Review the ${subjectLabel} before publishing.`;
  }

  if (eligibleCount === 0) {
    return `No ${subjectLabel} rows are eligible to publish. Remove blocked rows or change the batch and review again.`;
  }

  if (!walletReady) {
    return `Connect a wallet on ${networkName} before publishing.`;
  }

  if (hasNetworkMismatch) {
    return `Switch your wallet to ${networkName} to publish this ${subjectLabel} batch.`;
  }

  return null;
}
