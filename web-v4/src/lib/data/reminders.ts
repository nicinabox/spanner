import { request } from './server';
import type { RequestOpts } from './types';

export type ReminderType = '' | 'date_or_mileage' | 'mileage' | 'date';

export interface Reminder {
	id: number;
	vehicleId: number;
	notes: string;
	createdAt: string;
	updatedAt: string;
	date: string | null;
	mileage: number | null;
	reminderType: ReminderType | null;
	reminderDate: string | null;
	serviceScheduleId: number | null;
}

export interface ReminderCreateData {
	notes: string;
	date?: string | null;
	mileage?: number | null;
	reminderType?: ReminderType | null;
}

export type ReminderUpdateData = Partial<ReminderCreateData>;

export const getAllReminders = (opts: RequestOpts) => {
	return request<Reminder[]>('/reminders', opts);
};

export const getVehicleReminders = (vehicleId: number | string, opts: RequestOpts) => {
	return request<Reminder[]>(`/vehicles/${vehicleId}/reminders`, opts);
};

export const getReminder = (vehicleId: number | string, id: number | string, opts: RequestOpts) => {
	return request<Reminder>(`/vehicles/${vehicleId}/reminders/${id}`, opts);
};

export const createReminder = (data: ReminderCreateData, opts: RequestOpts) => {
	return request<Reminder>('/reminders', {
		...opts,
		method: 'POST',
		json: data,
	});
};

export const createVehicleReminder = (
	vehicleId: number | string,
	data: ReminderCreateData,
	opts: RequestOpts,
) => {
	return request<Reminder>(`/vehicles/${vehicleId}/reminders`, {
		...opts,
		method: 'POST',
		json: data,
	});
};

export const updateReminder = (
	vehicleId: number | string,
	id: number | string,
	data: ReminderUpdateData,
	opts: RequestOpts,
) => {
	return request<Reminder>(`/vehicles/${vehicleId}/reminders/${id}`, {
		...opts,
		method: 'PUT',
		json: data,
	});
};

export const deleteReminder = (
	vehicleId: number | string,
	id: number | string,
	opts: RequestOpts,
) => {
	return request<void>(`/vehicles/${vehicleId}/reminders/${id}`, {
		...opts,
		method: 'DELETE',
	});
};
