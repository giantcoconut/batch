import test from 'node:test';
import assert from 'node:assert/strict';

import { parseCsvRows } from '@/lib/csv/parse-csv';
import { parseCsvAtomText } from '@/lib/csv/atom-csv';
import { parseCsvListText } from '@/lib/csv/list-csv';

test('parseCsvRows handles quoted commas and escaped quotes', () => {
  const rows = parseCsvRows('name,description\n"Acme, Inc.","Says ""hello"""');

  assert.deepEqual(rows, [
    ['name', 'description'],
    ['Acme, Inc.', 'Says "hello"'],
  ]);
});

test('parseCsvRows rejects unclosed quotes', () => {
  assert.throws(() => parseCsvRows('name\n"Acme'), /unclosed quoted value/i);
});

test('parseCsvAtomText maps schema defaults and required fields', () => {
  const result = parseCsvAtomText('name,description\nAcme,Trusted builder', 'Thing');

  assert.equal(result.atoms.length, 1);
  assert.equal(result.atoms[0]?.schemaType, 'Thing');
  assert.equal(result.atoms[0]?.name, 'Acme');
  assert.equal(result.errors.length, 0);
});

test('parseCsvAtomText rejects when no usable atom column exists', () => {
  assert.throws(() => parseCsvAtomText('description\nMissing name'), /must include at least a name/i);
});

test('parseCsvListText accepts common member headers', () => {
  const result = parseCsvListText('member,description\nEthereum,Layer one');

  assert.equal(result.rows.length, 1);
  assert.equal(result.rows[0]?.memberName, 'Ethereum');
  assert.equal(result.rows[0]?.memberDescription, 'Layer one');
});
