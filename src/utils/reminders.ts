import { VehicleRecord } from 'queries/records';
import { VehicleReminder } from 'queries/reminders';
import { Vehicle } from 'queries/vehicles';
import { parseDateUTC } from './date';
import { sortRecordsNewestFirst } from './records';

export const getOverdueRemindersCount = (vehicle: Vehicle) => {
    if (vehicle.retired) return undefined;
    return vehicle.reminders.filter(isReminderOverdue).length;
};

export const isReminderOverdue = (reminder: VehicleReminder) => {
    if (!reminder.reminderDate) return false;
    const date = parseDateUTC(reminder.reminderDate);
    return new Date() > date;
};

export const getNewestRecordMileage = (records: VehicleRecord[] | undefined) => {
    return records?.sort(sortRecordsNewestFirst)[0] ?? 0;
};
