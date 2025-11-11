import {
	createAPIRequest,
	type CreatableFields,
	type RequestOpts,
	type UpdatableFields
} from './client';
import { apiConfig } from './config';
import type { Reminder } from './reminders';

export type DistanceUnit = 'mi' | 'km' | 'hr' | 'nmi';

export type VehicleSortStrategy = 'created_at' | 'name' | 'reminders' | 'mileage' | 'mileage_rate';

export type Sortable = [VehicleSortStrategy, Order];

export type Order = 'asc' | 'desc';

export interface VehiclePreferences {
	enableSharing: boolean;
	enableCost: boolean;
	sendReminderEmails: boolean;
	sendPromptForRecords: boolean;
	showMileageAdjustmentRecords: boolean;
}

export interface Vehicle {
	id: number;
	name: string;
	vin: string | null;
	notes: string;
	position: number | null;
	distanceUnit: DistanceUnit;
	retired: boolean;
	createdAt: string;
	milesPerDay: number | null;
	milesPerYear: number | null;
	estimatedMileage: number;
	squishVin: string | null;
	reminders: Reminder[];
	color: string | null;
	preferences: VehiclePreferences;
}

const request = createAPIRequest(apiConfig);

export const getAllVehicles = async (opts: RequestOpts) => {
	return request<Vehicle[]>('/vehicles', opts);
};

export const getVehicle = async (id: number | string, opts: RequestOpts) => {
	return request<Vehicle>(`/vehicles/${id}`, opts);
};

export const createVehicle = async (data: CreatableFields<Vehicle, 'name'>, opts: RequestOpts) => {
	return request<Vehicle>('/vehicles', {
		...opts,
		method: 'POST',
		body: JSON.stringify(data)
	});
};

export const updateVehicle = async (
	id: number | string,
	data: UpdatableFields<Vehicle>,
	opts: RequestOpts
) => {
	return request<Vehicle>(`/vehicles/${id}`, {
		...opts,
		method: 'PATCH',
		body: JSON.stringify(data)
	});
};

export const deleteVehicle = async (id: number | string, opts: RequestOpts) => {
	return request<void>(`/vehicles/${id}`, {
		...opts,
		method: 'DELETE'
	});
};
