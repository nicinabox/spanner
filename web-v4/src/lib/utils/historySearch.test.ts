import { describe, it, expect } from 'vitest';
import type { HistoryEntry } from '$lib/data/history';
import { buildHistoryFuse } from './historySearch.svelte';

const entry = (overrides: Partial<HistoryEntry>): HistoryEntry => ({
	id: 0,
	vehicleId: 1,
	date: '2026-01-01',
	cost: null,
	mileage: null,
	notes: '',
	createdAt: '2026-01-01T00:00:00.000Z',
	updatedAt: '2026-01-01T00:00:00.000Z',
	recordType: null,
	attachments: [],
	classifications: [],
	...overrides,
});

describe('buildHistoryFuse', () => {
	it('matches notes', () => {
		const fuse = buildHistoryFuse([
			entry({ id: 1, notes: 'oil change' }),
			entry({ id: 2, notes: 'tire rotation' }),
		]);
		expect(fuse.search('oil').map((r) => r.item.id)).toEqual([1]);
	});

	it('matches mileage with abbreviation (75k for 75000)', () => {
		const fuse = buildHistoryFuse([
			entry({ id: 1, mileage: 75000, notes: 'oil' }),
			entry({ id: 2, mileage: 10000, notes: 'oil' }),
		]);
		expect(fuse.search('75k').map((r) => r.item.id)).toEqual([1]);
	});

	it('matches date by month name', () => {
		const fuse = buildHistoryFuse([
			entry({ id: 1, date: '2026-03-15' }),
			entry({ id: 2, date: '2026-07-15' }),
		]);
		expect(fuse.search('March').map((r) => r.item.id)).toEqual([1]);
	});

	it('respects minMatchCharLength (single char returns nothing)', () => {
		const fuse = buildHistoryFuse([entry({ id: 1, notes: 'oil change' })]);
		expect(fuse.search('o').map((r) => r.item.id)).toEqual([]);
	});
});
