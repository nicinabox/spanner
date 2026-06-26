import type { HistoryEntry } from '$lib/data/history';
import type { Reminder } from '$lib/data/reminders';
import type { Vehicle } from '$lib/data/vehicles';
import { parseDateUTC } from './date';
import { sortNewestDateFirst } from './records';

export const getOverdueRemindersCount = (vehicle: Vehicle) => {
	if (vehicle.retired) return undefined;
	return vehicle.reminders.filter(isReminderOverdue).length;
};

export const isReminderOverdue = (reminder: Reminder, estimatedMileage?: number) => {
	if (reminder.reminderDate) {
		const date = parseDateUTC(reminder.reminderDate);
		if (new Date() > date) return true;
	}
	if (reminder.mileage && estimatedMileage != null && estimatedMileage >= reminder.mileage) {
		return true;
	}
	return false;
};

export const getNewestRecordMileage = (records: HistoryEntry[] | undefined) => {
	return records?.toSorted(sortNewestDateFirst)[0] ?? 0;
};
