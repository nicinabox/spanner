import { request } from './server';
import { updateUser } from './user';
import type { RequestOpts } from './types';

export const requestEmailChange = (email: string, host: string, opts: RequestOpts) => {
	return request(`/user/email_change`, {
		...opts,
		method: 'POST',
		json: { user: { email }, host },
	});
};

export const updateWebhookUrl = (webhookUrl: string, opts: RequestOpts) => {
	return updateUser({ preferences: { webhookUrl } }, opts);
};

export const deleteAccount = (opts: RequestOpts) => {
	return request(`/user`, { ...opts, method: 'DELETE' });
};

export type UnsubscribeContext = {
	unsubscribedAt: string | null;
	vehicle?: {
		id: number;
		name: string;
		preferences: {
			sendReminderEmails: boolean;
			sendPromptForRecords: boolean;
		};
	};
};

export const getUnsubscribeContext = (token: string, vehicleId?: number) => {
	const path = vehicleId ? `/account/${token}?vehicle_id=${vehicleId}` : `/account/${token}`;
	return request<UnsubscribeContext>(path);
};

export type VehiclePreferencesUpdate = {
	sendReminderEmails: boolean;
	sendPromptForRecords: boolean;
};

export const saveVehiclePreferences = (
	token: string,
	vehicleId: number,
	preferences: VehiclePreferencesUpdate,
) => {
	return request<{ preferences: VehiclePreferencesUpdate }>(`/account/${token}/preferences`, {
		method: 'POST',
		json: { vehicleId, ...preferences },
	});
};

export const unsubscribeAction = (token: string, action: 'unsubscribe' | 'reactivate') => {
	return request<{ unsubscribedAt: string | null }>(`/account/${token}`, {
		method: 'POST',
		json: { actionType: action },
	});
};
