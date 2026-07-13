import { describe, it, expect } from 'vitest';
import type { HistoryEntry } from '$lib/data/history';
import type { Classification } from '$lib/data/classifications';
import { buildHistoryFuse } from './historySearch.svelte';

const classification = (overrides: Partial<Classification>): Classification => ({
	id: 0,
	vehicleId: 1,
	name: '',
	keywords: [],
	createdAt: '2026-01-01T00:00:00.000Z',
	updatedAt: '2026-01-01T00:00:00.000Z',
	...overrides,
});

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

	it('matches classification name', () => {
		const fuse = buildHistoryFuse([
			entry({
				id: 1,
				classifications: [classification({ name: 'Oil Change' })],
			}),
			entry({
				id: 2,
				classifications: [classification({ name: 'Tire Rotation' })],
			}),
		]);
		expect(fuse.search('Oil').map((r) => r.item.id)).toEqual([1]);
	});

	it('matches classification keyword', () => {
		const fuse = buildHistoryFuse([
			entry({
				id: 1,
				classifications: [
					classification({ name: 'Oil Change', keywords: ['engine oil', 'oil filter'] }),
				],
			}),
			entry({
				id: 2,
				classifications: [classification({ name: 'Tire Rotation' })],
			}),
		]);
		expect(fuse.search('filter').map((r) => r.item.id)).toEqual([1]);
	});

	it('returns nothing for records with no matching classification', () => {
		const fuse = buildHistoryFuse([
			entry({
				id: 1,
				classifications: [classification({ name: 'Tire Rotation' })],
			}),
		]);
		expect(fuse.search('oil').map((r) => r.item.id)).toEqual([]);
	});
});
