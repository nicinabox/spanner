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

export const getReminder = (id: number | string, opts: RequestOpts) => {
	return request<Reminder>(`/reminders/${id}`, opts);
};

export const createReminder = (data: CreatableFields<Reminder>, opts: RequestOpts) => {
	return request<Reminder>('/reminders', {
		...opts,
		method: 'POST',
		json: data
	});
};

export const updateReminder = (
	id: number | string,
	data: CreatableFields<Reminder>,
	opts: RequestOpts
) => {
	return request<Reminder>(`/reminders/${id}`, {
		...opts,
		method: 'PUT',
		json: data
	});
};

export const deleteReminder = (id: number | string, opts: RequestOpts) => {
	return request<void>(`/reminders/${id}`, {
		...opts,
		method: 'DELETE'
	});
};
