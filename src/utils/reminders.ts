import { VehicleReminder } from 'queries/reminders';

export const getOverdueRemindersCount = (reminders: VehicleReminder[]) => {
    return reminders.filter(isReminderOverdue).length;
};

export const isReminderOverdue = (reminder: VehicleReminder) => {
    if (!reminder.date) return false;
    const date = new Date(reminder.date);
    return new Date() > date;
};
