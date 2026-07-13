import { describe, it, expect } from 'vitest';
import type { HistoryEntry } from '$lib/data/history';
import { sortNewestDateFirst } from './records';

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

describe('sortNewestDateFirst', () => {
	it('sorts newer dates before older dates', () => {
		const older = entry({ id: 1, date: '2026-01-01' });
		const newer = entry({ id: 2, date: '2026-02-01' });
		expect([older, newer].toSorted(sortNewestDateFirst).map((r) => r.id)).toEqual([2, 1]);
	});

	it('breaks date ties by createdAt descending (newest created first)', () => {
		const firstCreated = entry({
			id: 1,
			date: '2026-01-01',
			mileage: 100,
			createdAt: '2026-01-01T08:00:00.000Z',
		});
		const secondCreated = entry({
			id: 2,
			date: '2026-01-01',
			mileage: 100,
			createdAt: '2026-01-01T09:00:00.000Z',
		});
		const thirdCreated = entry({
			id: 3,
			date: '2026-01-01',
			mileage: 100,
			createdAt: '2026-01-01T10:00:00.000Z',
		});
		expect([firstCreated, thirdCreated, secondCreated].toSorted(sortNewestDateFirst).map((r) => r.id)).toEqual([3, 2, 1]);
	});

	it('does not reverse order of tied records (regression)', () => {
		const a = entry({
			id: 1,
			date: '2026-01-01',
			mileage: 100,
			createdAt: '2026-01-01T08:00:00.000Z',
		});
		const b = entry({
			id: 2,
			date: '2026-01-01',
			mileage: 100,
			createdAt: '2026-01-01T09:00:00.000Z',
		});
		expect([a, b].toSorted(sortNewestDateFirst).map((r) => r.id)).toEqual([2, 1]);
	});

	it('handles empty array', () => {
		expect([].toSorted(sortNewestDateFirst)).toEqual([]);
	});
});
