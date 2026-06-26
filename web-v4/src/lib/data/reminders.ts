import { createAPIRequest, type CreatableFields, type RequestOpts } from './client';

export type ReminderType = '' | 'date_or_mileage' | 'mileage' | 'date';

export interface Reminder {
	id: number;
	notes: string;
	createdAt: string;
	updatedAt: string;
	date: string | null;
	mileage: number | null;
	reminderType: ReminderType | null;
	reminderDate: string | null;
}

const request = createAPIRequest();

export const getAllReminders = (opts: RequestOpts) => {
	return request<Reminder[]>('/reminders', opts);
};

export const getVehicleReminders = (vehicleId: number | string, opts: RequestOpts) => {
	return request<Reminder[]>(`/vehicles/${vehicleId}/reminders`, opts);
};

export const getReminder = (vehicleId: number | string, id: number | string, opts: RequestOpts) => {
	return request<Reminder>(`/vehicles/${vehicleId}/reminders/${id}`, opts);
};

export const createReminder = (data: CreatableFields<Reminder>, opts: RequestOpts) => {
	return request<Reminder>('/reminders', {
		...opts,
		method: 'POST',
		json: data,
	});
};

export const createVehicleReminder = (
	vehicleId: number | string,
	data: CreatableFields<Reminder>,
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
	data: CreatableFields<Reminder>,
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

export const estimateReminderDate = async (
	vehicleId: number | string,
	params: { mileage: number; date: string; reminderType: string },
): Promise<{ reminderDate: string }> => {
	return request(`/vehicles/${vehicleId}/reminders/estimate_date`, {
		method: 'GET',
		params,
	});
};
