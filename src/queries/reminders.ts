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

export const remindersAPIPath = (vehicleId: RecordID) => `/api/vehicles/${vehicleId}/reminders`;
export const reminderAPIPath = (vehicleId: RecordID, reminderId: RecordID) => `/api/vehicles/${vehicleId}/reminders/${reminderId}`;

export function fetchReminders(api: AxiosInstance, vehicleId: RecordID) {
    return api.get<VehicleReminder[]>(remindersAPIPath(vehicleId));
}

export function createReminder(api: AxiosInstance, vehicleId: RecordID, reminder: VehicleReminderParams) {
    return api.post<VehicleReminder>(remindersAPIPath(vehicleId), reminder);
}

export async function estimateReminderDate(api: AxiosInstance, vehicleId: RecordID, reminder: EstimateReminderParams) {
    const { data } = await api.get(`/api/vehicles/${vehicleId}/reminders/estimate_date`, {
        params: {
            reminder,
        },
    });
    return data;
}

export async function destroyReminder(api: AxiosInstance, vehicleId: RecordID, reminderId: RecordID) {
    const { data } = await api.delete(`/api/vehicles/${vehicleId}/reminders/${reminderId}`);
    return data;
}

// export function updateReminder(vehicleId, reminderId, params) {
// return put(`/vehicles/${vehicleId}/reminders/${reminderId}`, params, UPDATE_REMINDER, {
//     vehicleId,
//     reminderId,
// })
// }
