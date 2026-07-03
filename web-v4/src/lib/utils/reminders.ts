import type { HistoryEntry } from '$lib/data/history';
import type { Reminder } from '$lib/data/reminders';
import type { Vehicle } from '$lib/data/vehicles';
import { parseDateUTC } from './date';
import { sortNewestDateFirst } from './records';

export const getOverdueRemindersCount = (vehicle: Vehicle) => {
	if (vehicle.retired) return undefined;
	return (vehicle.reminders ?? []).filter(isReminderOverdue).length;
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

export const sortRemindersByDue = (reminders: Reminder[], estimatedMileage?: number) => {
	return [...reminders].sort((a, b) => {
		const aOverdue = isReminderOverdue(a, estimatedMileage);
		const bOverdue = isReminderOverdue(b, estimatedMileage);
		if (aOverdue && !bOverdue) return -1;
		if (!aOverdue && bOverdue) return 1;

		const aDate = a.reminderDate ?? a.date;
		const bDate = b.reminderDate ?? b.date;
		if (!aDate && !bDate) return 0;
		if (!aDate) return 1;
		if (!bDate) return -1;
		return new Date(aDate).getTime() - new Date(bDate).getTime();
	});
};
