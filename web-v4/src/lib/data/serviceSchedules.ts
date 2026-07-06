import { request } from './server';
import type { CreatableFields, RequestOpts } from './types';

export interface ServiceSchedule {
	id: number;
	vehicleId: number;
	classificationId: number;
	distanceInterval: number | null;
	monthInterval: number | null;
	notes: string | null;
	enabled: boolean;
	lastCompletedRecordId: number | null;
	nextDueDate: string | null;
	nextDueMileage: number | null;
	createdAt: string;
	updatedAt: string;
}

export interface SchedulePreset {
	name: string;
	distanceInterval: number | null;
	monthInterval: number | null;
	keywords: string[];
}

export const getServiceSchedule = (vehicleId: number | string, id: number | string, opts: RequestOpts) => {
	return request<ServiceSchedule>(`/vehicles/${vehicleId}/service_schedules/${id}`, opts);
};

export const getServiceSchedules = (vehicleId: number | string, opts: RequestOpts) => {
	return request<ServiceSchedule[]>(`/vehicles/${vehicleId}/service_schedules`, opts);
};

export interface CreateServiceScheduleData {
	serviceSchedule: {
		classificationId: number;
		distanceInterval: number | null;
		monthInterval: number | null;
		notes?: string | null;
	};
}

export const createServiceSchedule = (
	vehicleId: number | string,
	data: CreatableFields<CreateServiceScheduleData>,
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

export const getPresets = (opts: RequestOpts) => {
	return request<Record<string, SchedulePreset[]>>('/service_schedules/presets', opts);
};
