export type ReviewStatus =
  | 'ready_to_create'
  | 'existing'
  | 'skip_existing'
  | 'blocked_duplicate'
  | 'ambiguous'
  | 'missing'
  | 'invalid';

export interface ReviewRow<TPayload> {
  id: string;
  label: string;
  status: ReviewStatus;
  message: string;
  payload: TPayload;
}
