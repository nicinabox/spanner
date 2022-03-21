import { AxiosInstance } from 'axios';
import { MutateParams } from './config';

export type ReminderParams = Partial<Omit<API.Reminder, 'vehicleId'>>;

export type EstimateReminderParams = Pick<API.Reminder, 'date' | 'mileage' | 'reminderType'>

export const remindersAPIPath = (vehicleId: API.RecordID) => `/api/vehicles/${vehicleId}/reminders`;
export const reminderAPIPath = (vehicleId: API.RecordID, reminderId: API.RecordID) => `/api/vehicles/${vehicleId}/reminders/${reminderId}`;

export function fetchReminders(api: AxiosInstance, vehicleId: API.RecordID) {
    return api.get<API.Reminder[]>(remindersAPIPath(vehicleId));
}

export function createReminder(api: AxiosInstance, vehicleId: API.RecordID, reminder: ReminderParams) {
    return api.post<API.Reminder>(remindersAPIPath(vehicleId), reminder);
}

export function updateReminder(api: AxiosInstance, vehicleId: API.RecordID, params: MutateParams<ReminderParams>) {
    return api.put(reminderAPIPath(vehicleId, params.id), params);
}

export async function createOrUpdateReminder(api: AxiosInstance, vehicleId: API.RecordID, params: ReminderParams) {
    if (params.id) {
        return updateReminder(api, vehicleId, params as MutateParams<typeof params>);
    }
    return createReminder(api, vehicleId, params);
}

export async function destroyReminder(api: AxiosInstance, vehicleId: API.RecordID, reminderId: API.RecordID) {
    const { data } = await api.delete(`/api/vehicles/${vehicleId}/reminders/${reminderId}`);
    return data;
}

export async function estimateReminderDate(api: AxiosInstance, vehicleId: API.RecordID, reminder: EstimateReminderParams) {
    const { data } = await api.get(`/api/vehicles/${vehicleId}/reminders/estimate_date`, {
        params: {
            reminder,
        },
    });
    return data;
}
