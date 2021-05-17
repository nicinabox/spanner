import { AxiosInstance } from 'axios';
import { RecordID } from './config';

export type ReminderType = '' | 'date_or_mileage' | 'mileage' | 'date';

export interface VehicleReminder {
    id: string;
    notes: string;
    date: string;
    mileage: number;
    reminderType: ReminderType;
    reminderDate: string;
    vehicleId: number;
}

export type VehicleReminderParams = Pick<VehicleReminder, 'notes' | 'date' | 'mileage' | 'reminderType'>

export type EstimateReminderParams = Pick<VehicleReminder, 'date' | 'mileage' | 'reminderType'>

export const vehicleRemindersPath = (vehicleId: string | number) => `/api/vehicles/${vehicleId}/reminders`;

export function fetchReminders(api: AxiosInstance, vehicleId: string | number) {
    return api.get<VehicleReminder[]>(vehicleRemindersPath(vehicleId));
}

export function createReminder(api: AxiosInstance, vehicleId: string | number, reminder: VehicleReminderParams) {
    return api.post<VehicleReminder>(vehicleRemindersPath(vehicleId), reminder);
}

export async function estimateReminderDate(api: AxiosInstance, vehicleId: RecordID, reminder: EstimateReminderParams) {
    const { data } = await api.get(`/api/vehicles/${vehicleId}/reminders/estimate_date`, {
        params: {
            reminder,
        },
    });
    return data;
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
