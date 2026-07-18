import { describe, it, expect } from 'vitest';
import type { ServiceSchedule } from '$lib/data/serviceSchedules';
import { isScheduleOverdue } from './tasks';

const schedule = (overrides: Partial<ServiceSchedule>): ServiceSchedule => ({
	id: 1,
	vehicleId: 1,
	classificationId: 1,
	classificationName: null,
	distanceInterval: null,
	monthInterval: null,
	notes: null,
	enabled: true,
	lastCompletedRecordId: null,
	nextDueDate: null,
	nextDueMileage: null,
	deferred: false,
	deferDeltaMonths: null,
	deferDeltaMiles: null,
	createdAt: '2026-01-01T00:00:00.000Z',
	updatedAt: '2026-01-01T00:00:00.000Z',
	...overrides,
});

describe('isScheduleOverdue', () => {
	it('returns true when next_due_date is in the past', () => {
		const s = schedule({ nextDueDate: '2020-01-01' });
		expect(isScheduleOverdue(s)).toBe(true);
	});

	it('returns false when next_due_date is in the future', () => {
		const s = schedule({ nextDueDate: '2099-01-01' });
		expect(isScheduleOverdue(s)).toBe(false);
	});

	it('returns false when next_due_date is null', () => {
		const s = schedule({});
		expect(isScheduleOverdue(s)).toBe(false);
	});

	it('returns false when schedule is deferred (defer pushed date into future)', () => {
		// next_due_date is server-derived and already accounts for defer.
		// No separate deferred check needed in the UI.
		const s = schedule({ nextDueDate: '2099-01-01', deferred: true });
		expect(isScheduleOverdue(s)).toBe(false);
	});

	it('ignores next_due_mileage — overdue is decided by next_due_date alone', () => {
		const s = schedule({ nextDueDate: '2099-01-01', nextDueMileage: 50_000 });
		expect(isScheduleOverdue(s)).toBe(false);
	});
});
