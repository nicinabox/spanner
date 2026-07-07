import type { ServiceSchedule } from '$lib/data/serviceSchedules';
import type { DistanceUnit, Vehicle } from '$lib/data/vehicles';
import { parseDateUTC } from './date';
import { formatMileage } from './vehicle';

export const getOverdueSchedulesCount = (vehicle: Vehicle) => {
	if (vehicle.retired) return undefined;
	return vehicle.serviceSchedules.filter((s) => isScheduleOverdue(s, vehicle.estimatedMileage))
		.length;
};

export const isScheduleOverdue = (schedule: ServiceSchedule, estimatedMileage?: number) => {
	if (schedule.nextDueDate) {
		const date = parseDateUTC(schedule.nextDueDate);
		if (new Date() > date) return true;
	}
	if (
		schedule.nextDueMileage &&
		estimatedMileage != null &&
		estimatedMileage >= schedule.nextDueMileage
	) {
		return true;
	}
	return false;
};

export const sortSchedulesByDue = (schedules: ServiceSchedule[], estimatedMileage?: number) => {
	return [...schedules].sort((a, b) => {
		const aOverdue = isScheduleOverdue(a, estimatedMileage);
		const bOverdue = isScheduleOverdue(b, estimatedMileage);

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
	return parts.join(' or ');
};
