import { request } from './server';
import type { RequestOpts } from './types';

export interface ServiceSchedule {
	id: number;
	vehicle_id: number;
	classification_id: number;
	distance_interval: number | null;
	month_interval: number | null;
	notes: string | null;
	enabled: boolean;
	last_completed_record_id: number | null;
	next_due_date: string | null;
	next_due_mileage: number | null;
	created_at: string;
	updated_at: string;
}

export const getServiceSchedules = (vehicleId: number | string, opts: RequestOpts) => {
	return request<ServiceSchedule[]>(`/vehicles/${vehicleId}/service_schedules`, opts);
};

export const createServiceSchedule = (
	vehicleId: number | string,
	data: Record<string, unknown>,
	opts: RequestOpts,
) => {
	return request<ServiceSchedule>(`/vehicles/${vehicleId}/service_schedules`, {
		...opts,
		method: 'POST',
		json: data,
	});
};

export const updateServiceSchedule = (
	vehicleId: number | string,
	id: number | string,
	data: Record<string, unknown>,
	opts: RequestOpts,
) => {
	return request<ServiceSchedule>(`/vehicles/${vehicleId}/service_schedules/${id}`, {
		...opts,
		method: 'PUT',
		json: data,
	});
};

export const deleteServiceSchedule = (
	vehicleId: number | string,
	id: number | string,
	opts: RequestOpts,
) => {
	return request<void>(`/vehicles/${vehicleId}/service_schedules/${id}`, {
		...opts,
		method: 'DELETE',
	});
};

export const completeServiceSchedule = (
	vehicleId: number | string,
	id: number | string,
	data: Record<string, unknown> | undefined,
	opts: RequestOpts,
) => {
	return request<ServiceSchedule>(`/vehicles/${vehicleId}/service_schedules/${id}/complete`, {
		...opts,
		method: 'POST',
		json: data,
	});
};
