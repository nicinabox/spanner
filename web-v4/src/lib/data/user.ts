import { createAPIRequest, type RequestOpts, type UpdatableFields } from './client';
import type { Sortable } from './vehicles';

export interface User {
	id: number;
	email: string;
	createdAt: string;
	updatedAt: string;
	timeZoneOffset: string | null;
	preferences: {
		vehiclesSortOrder: Sortable;
	};
}

const request = createAPIRequest();

export const getCurrentUser = (opts: RequestOpts) => {
	return request<User>(`/user`, opts);
};

export const updateUser = (user: UpdatableFields<User>, opts: RequestOpts) => {
	return request<User>(`/user`, { ...opts, method: 'PUT', json: user });
};
