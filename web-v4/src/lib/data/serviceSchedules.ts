import { request } from './server';
import type { Classification } from './classifications';
import type { RequestOpts } from './types';
import type { PresetGroup } from './serviceSchedules.remote';

export interface ServiceSchedule {
	id: number;
	vehicleId: number;
	classificationId: number;
	classificationName: string | null;
	classification?: Classification;
	distanceInterval: number | null;
	monthInterval: number | null;
	notes: string | null;
	enabled: boolean;
	lastCompletedRecordId: number | null;
	nextDueDate: string | null;
	nextDueMileage: number | null;
	deferred: boolean;
	deferDeltaMonths: number | null;
	deferDeltaMiles: number | null;
	createdAt: string;
	updatedAt: string;
}

export interface ServiceScheduleCreateData {
	classificationId?: number;
	classificationName?: string;
	keywords?: string[];
	distanceInterval?: number;
	monthInterval?: number;
	notes?: string | null;
}

export type ServiceScheduleUpdateData = Partial<ServiceScheduleCreateData>;

export const getServiceSchedule = (
	vehicleId: number | string,
	id: number | string,
	opts: RequestOpts,
) => {
	return request<ServiceSchedule>(`/vehicles/${vehicleId}/service_schedules/${id}`, opts);
};

export const getServiceSchedules = (vehicleId: number | string, opts: RequestOpts) => {
	return request<ServiceSchedule[]>(`/vehicles/${vehicleId}/service_schedules`, opts);
};

export const createServiceSchedule = (
	vehicleId: number | string,
	data: ServiceScheduleCreateData,
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
	data: ServiceScheduleUpdateData,
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

export const deferServiceSchedule = (
	vehicleId: number | string,
	id: number | string,
	data: { months?: number | null; distance?: number | null } | undefined,
	opts: RequestOpts,
) => {
	return request<ServiceSchedule>(`/vehicles/${vehicleId}/service_schedules/${id}/defer`, {
		...opts,
		method: 'POST',
		json: data ?? {},
	});
};

export const clearDeferServiceSchedule = (
	vehicleId: number | string,
	id: number | string,
	opts: RequestOpts,
) => {
	return request<ServiceSchedule>(`/vehicles/${vehicleId}/service_schedules/${id}/defer`, {
		...opts,
		method: 'DELETE',
	});
};

export const getPresets = (opts: RequestOpts) => {
	return request<Record<string, PresetGroup>>('/service_schedules/presets', opts);
};
