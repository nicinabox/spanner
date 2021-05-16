import { VehicleReminder } from 'queries/reminders';

export const isReminderOverdue = (reminder: VehicleReminder) => {
    if (!reminder.date) return false;
    const date = new Date(reminder.date);
    return new Date() > date;
};
