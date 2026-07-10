import { request } from './server';
import type { RequestOpts } from './types';

export interface Classification {
	id: number;
	key: string | null;
	name: string;
	system: boolean;
	vehicleId: number | null;
	keywords: string[];
	createdAt: string;
	updatedAt: string;
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

export const addRecordClassification = (
	vehicleId: number | string,
	recordId: number | string,
	classificationId: number,
	opts: RequestOpts,
) => {
	return request<void>(`/vehicles/${vehicleId}/records/${recordId}/record_classifications`, {
		...opts,
		method: 'POST',
		json: { classificationId },
	});
};

export const removeRecordClassification = (
	vehicleId: number | string,
	recordId: number | string,
	classificationId: number,
	opts: RequestOpts,
) => {
	return request<void>(
		`/vehicles/${vehicleId}/records/${recordId}/record_classifications/${classificationId}`,
		{
			...opts,
			method: 'DELETE',
		},
	);
};
