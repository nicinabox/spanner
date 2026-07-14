import { request } from './server';
import type { RequestOpts } from './types';
import type { Sortable } from './vehicles';

export interface User {
	id: number;
	email: string;
	createdAt: string;
	updatedAt: string;
	timeZoneOffset: string | null;
	passwordEnabled: boolean;
	preferences: {
		vehiclesSortOrder?: Sortable;
		webhookUrl?: string;
	};
}

export interface UserUpdateData {
	timeZoneOffset?: string;
	preferences?: {
		vehiclesSortOrder?: Sortable;
		webhookUrl?: string;
	};
}

export const getCurrentUser = (opts: RequestOpts) => {
	return request<User>(`/user`, opts);
};

export const updateUser = (user: UserUpdateData, opts: RequestOpts) => {
	return request<User>(`/user`, { ...opts, method: 'PUT', json: user });
};
