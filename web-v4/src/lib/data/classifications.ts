import { request } from './server';
import type { RequestOpts } from './types';

export interface Classification {
	id: number;
	key: string | null;
	name: string;
	system: boolean;
	vehicle_id: number | null;
	keywords: string[];
	created_at: string;
	updated_at: string;
}

export const getClassifications = (vehicleId: number | string, opts: RequestOpts) => {
	return request<Classification[]>(`/vehicles/${vehicleId}/classifications`, opts);
};

export const createClassification = (
	vehicleId: number | string,
	data: Record<string, unknown>,
	opts: RequestOpts,
) => {
	return request<Classification>(`/vehicles/${vehicleId}/classifications`, {
		...opts,
		method: 'POST',
		json: data,
	});
};

export const updateClassification = (
	id: number | string,
	data: Record<string, unknown>,
	opts: RequestOpts,
) => {
	return request<Classification>(`/classifications/${id}`, {
		...opts,
		method: 'PUT',
		json: data,
	});
};

export const deleteClassification = (id: number | string, opts: RequestOpts) => {
	return request<void>(`/classifications/${id}`, {
		...opts,
		method: 'DELETE',
	});
};
