import { createAPIRequest, type CreatableFields } from './client';

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

export const getAllReminders = () => {
	return request<Reminder[]>('/reminders');
};

export const getReminder = (id: number) => {
	return request<Reminder>(`/reminders/${id}`);
};

export const createReminder = (data: CreatableFields<Reminder>) => {
	return request<Reminder>('/reminders', {
		method: 'POST',
		body: JSON.stringify(data)
	});
};

export const updateReminder = (id: number, data: CreatableFields<Reminder>) => {
	return request<Reminder>(`/reminders/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data)
	});
};

export const deleteReminder = (id: number) => {
	return request<void>(`/reminders/${id}`, {
		method: 'DELETE'
	});
};
