import { VehicleReminder } from 'queries/reminders';
import { Vehicle } from 'queries/vehicles';

export const getOverdueRemindersCount = (vehicle: Vehicle) => {
    if (vehicle.retired) return undefined;
    return vehicle.reminders.filter(isReminderOverdue).length;
};

export const isReminderOverdue = (reminder: VehicleReminder) => {
    if (!reminder.date) return false;
    const date = new Date(reminder.reminderDate);
    return new Date() > date;
};
