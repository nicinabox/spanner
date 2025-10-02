import { parseDateUTC } from './date';
import { sortRecordsNewestFirst } from './records';

export const getOverdueRemindersCount = (vehicle: API.Vehicle) => {
    if (vehicle.retired) return undefined;
    return vehicle.reminders.filter(isReminderOverdue).length;
};

export const isReminderOverdue = (reminder: API.Reminder) => {
    if (!reminder.reminderDate) return false;
    const date = parseDateUTC(reminder.reminderDate);
    return new Date() > date;
};

export const getNewestRecordMileage = (records: API.Record[] | undefined) => {
    return records?.sort(sortRecordsNewestFirst)[0] ?? 0;
};
