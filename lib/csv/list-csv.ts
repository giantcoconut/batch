import { findHeaderIndex, parseCsvRows, slugifyCsvHeader } from '@/lib/csv/parse-csv';
import { createLocalId } from '@/lib/utils/ids';
import type { ListMemberRow } from '@/types/lists';

export const MAX_LIST_BATCH_SIZE = 50;

export function parseCsvListText(
  text: string,
): { rows: ListMemberRow[]; errors: string[] } {
  const rows = parseCsvRows(text);

  if (rows.length === 0) {
    throw new Error('CSV is empty.');
  }

  const headerRow = rows[0];
  if (!headerRow) {
    throw new Error('CSV is empty.');
  }

  const headers = headerRow.map(slugifyCsvHeader);
  const memberHeaderIndex = findHeaderIndex(headers, ['subject_name', 'subjectname', 'name', 'member', 'atom', 'label', 'subject']);
  const descriptionHeaderIndex = findHeaderIndex(headers, ['subject_description', 'subjectdescription', 'description', 'summary']);

  if (memberHeaderIndex === -1) {
    throw new Error('CSV must include a subject_name column. name, member, atom, label, and subject are also accepted.');
  }

  const parsedRows: ListMemberRow[] = [];
  const errors: string[] = [];

  rows.slice(1).forEach((cells, rowIndex) => {
    const memberName = (cells[memberHeaderIndex] ?? '').trim();
    const memberDescription = descriptionHeaderIndex === -1 ? '' : (cells[descriptionHeaderIndex] ?? '').trim();
    const sourceLine = rowIndex + 2;

    if (!memberName) {
      errors.push(`Line ${sourceLine}: Missing member name.`);
    }

    parsedRows.push({
      id: createLocalId('list-member'),
      sourceLine,
      memberName,
      memberDescription,
      selectedAtom: null,
      candidates: [],
    });
  });

  if (parsedRows.every((row) => !row.memberName.trim())) {
    throw new Error('CSV did not contain any usable members.');
  }

  if (parsedRows.length > MAX_LIST_BATCH_SIZE) {
    errors.push(`CSV import is limited to ${MAX_LIST_BATCH_SIZE} list entries per transaction.`);
  }

  return { rows: parsedRows, errors };
}
