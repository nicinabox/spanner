import { createAPIRequest, type RequestOpts } from './client';

const request = createAPIRequest();

// Public client — no auth headers for unsubscribe
const publicRequest = createAPIRequest({
	authHeaderValue: () => undefined,
});

export const requestEmailChange = (email: string, host: string, opts: RequestOpts) => {
	return request(`/user/email_change`, {
		...opts,
		method: 'POST',
		json: { user: { email }, host },
	});
};

export const deleteAccount = (opts: RequestOpts) => {
	return request(`/user`, { ...opts, method: 'DELETE' });
};

export const unsubscribe = (token: string) => {
	return publicRequest<{ message: string }>(`/unsubscribe/${token}`);
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
	const path = vehicleId
		? `/account/${token}?vehicle_id=${vehicleId}`
		: `/account/${token}`;
	return publicRequest<UnsubscribeContext>(path);
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
	return publicRequest<{ preferences: VehiclePreferencesUpdate }>(
		`/account/${token}/preferences`,
		{ method: 'POST', json: { vehicleId, ...preferences } },
	);
};

export const unsubscribeAction = (
	token: string,
	action: 'unsubscribe' | 'reactivate',
) => {
	return publicRequest<{ unsubscribedAt: string | null }>(`/account/${token}`, {
		method: 'POST',
		json: { actionType: action },
	});
};
