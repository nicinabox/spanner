import type { ServiceSchedule } from '$lib/data/serviceSchedules';
import type { DistanceUnit, Vehicle } from '$lib/data/vehicles';
import { parseDateUTC } from './date';
import { formatMileage } from './vehicle';
import { getOverdueRemindersCount, isReminderOverdue } from './reminders';
import type { Reminder } from '$lib/data/reminders';

export function getUnifiedOverdueCount(vehicle: Vehicle) {
	const r = getOverdueRemindersCount(vehicle) ?? 0;
	const s = getOverdueSchedulesCount(vehicle) ?? 0;
	return r + s;
}

export const getOverdueSchedulesCount = (vehicle: Vehicle) => {
	if (vehicle.retired) return undefined;
	return vehicle.serviceSchedules.filter((s) => isScheduleOverdue(s)).length;
};

export const isScheduleOverdue = (schedule: ServiceSchedule) => {
	if (!schedule.nextDueDate) return false;
	return new Date() > parseDateUTC(schedule.nextDueDate);
};

export const sortSchedulesByDue = (schedules: ServiceSchedule[], estimatedMileage?: number) => {
	return [...schedules].sort((a, b) => {
		const aOverdue = isScheduleOverdue(a);
		const bOverdue = isScheduleOverdue(b);

		if (aOverdue && !bOverdue) return -1;
		if (!aOverdue && bOverdue) return 1;

		const aDate = a.nextDueDate ? new Date(a.nextDueDate).getTime() : Infinity;
		const bDate = b.nextDueDate ? new Date(b.nextDueDate).getTime() : Infinity;

		if (aDate !== bDate) return aDate - bDate;

		const aMileage = a.nextDueMileage ?? Infinity;
		const bMileage = b.nextDueMileage ?? Infinity;

		return aMileage - bMileage;
	});
};

export const getIntervalSummary = (
	schedule: Pick<ServiceSchedule, 'monthInterval' | 'distanceInterval'>,
	distanceUnit: DistanceUnit = 'mi',
): string => {
	const parts: string[] = [];
	if (schedule.monthInterval) {
		parts.push(`${schedule.monthInterval} mo`);
	}
	if (schedule.distanceInterval) {
		parts.push(formatMileage(schedule.distanceInterval, distanceUnit));
	}
	return `Every ${parts.join(' or ')}`;
};

// --- new unified sort ---

export type UnifiedItem =
	| { kind: 'reminder'; data: Reminder }
	| { kind: 'schedule'; data: ServiceSchedule };

export function sortUnifiedByDue(
	reminders: Reminder[],
	schedules: ServiceSchedule[],
	estimatedMileage?: number,
): UnifiedItem[] {
	const items: UnifiedItem[] = [
		...reminders.map((r) => ({ kind: 'reminder' as const, data: r })),
		...schedules.map((s) => ({ kind: 'schedule' as const, data: s })),
	];

	return items.sort((a, b) => {
		const aOverdue =
			a.kind === 'reminder'
				? isReminderOverdue(a.data, estimatedMileage)
				: isScheduleOverdue(a.data);
		const bOverdue =
			b.kind === 'reminder'
				? isReminderOverdue(b.data, estimatedMileage)
				: isScheduleOverdue(b.data);

		if (aOverdue && !bOverdue) return -1;
		if (!aOverdue && bOverdue) return 1;

		const aDate = a.kind === 'reminder' ? (a.data.reminderDate ?? a.data.date) : a.data.nextDueDate;
		const bDate = b.kind === 'reminder' ? (b.data.reminderDate ?? b.data.date) : b.data.nextDueDate;

		if (!aDate && !bDate) return 0;
		if (!aDate) return 1;
		if (!bDate) return -1;

		const aTime = new Date(aDate).getTime();
		const bTime = new Date(bDate).getTime();
		if (aTime !== bTime) return aTime - bTime;

		const aMileage =
			a.kind === 'reminder' ? (a.data.mileage ?? Infinity) : (a.data.nextDueMileage ?? Infinity);
		const bMileage =
			b.kind === 'reminder' ? (b.data.mileage ?? Infinity) : (b.data.nextDueMileage ?? Infinity);

		return aMileage - bMileage;
	});
}
