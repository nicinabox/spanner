import { AxiosInstance } from "axios";

export interface VehicleReminder {
    id: string;
    notes: string;
    date: string;
    mileage: number;
    reminderType: 'date_or_mileage' | 'mileage' | 'date';
    remindeDate: string;
    vehicleId: number;
}

type VehicleReminderParams = Pick<VehicleReminder, 'notes' | 'date' | 'mileage' | 'reminderType'>

export const vehicleRemindersPath = (vehicleId: string | number) => `/api/vehicles/${vehicleId}/reminders`;

export function fetchReminders(api: AxiosInstance, vehicleId: string | number) {
    return api.get<VehicleReminder[]>(vehicleRemindersPath(vehicleId));
}

export function createReminder(api: AxiosInstance, vehicleId: string | number, reminder: VehicleReminderParams) {
    return api.post<VehicleReminder>(vehicleRemindersPath(vehicleId), reminder);
}

// export function destroyReminder(vehicleId, reminderId) {
// return destroy(`/vehicles/${vehicleId}/reminders/${reminderId}`, null, DESTROY_REMINDER, {
//     vehicleId,
//     reminderId,
// })
// }

// export function updateReminder(vehicleId, reminderId, params) {
// return put(`/vehicles/${vehicleId}/reminders/${reminderId}`, params, UPDATE_REMINDER, {
//     vehicleId,
//     reminderId,
// })
// }

// export function estimateReminderDate(vehicleId, reminder) {
// return get(
//     `/vehicles/${vehicleId}/reminders/estimate_date`,
//     { reminder },
//     ESTIMATE_REMINDER_DATE,
//     { vehicleId }
// )
// }
