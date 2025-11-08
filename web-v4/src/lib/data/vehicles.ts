import { createAPIRequest, type CreatableFields, type UpdatableFields } from './client';
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

export const getAllVehicles = async () => {
	return request<Vehicle[]>('/vehicles');
};

export const getVehicle = async (id: number) => {
	return request<Vehicle>(`/vehicles/${id}`);
};

export const createVehicle = async (data: CreatableFields<Vehicle>) => {
	return request<Vehicle>('/vehicles', {
		method: 'POST',
		body: JSON.stringify(data)
	});
};

export const updateVehicle = async (id: number, data: UpdatableFields<Vehicle>) => {
	return request<Vehicle>(`/vehicles/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(data)
	});
};

export const deleteVehicle = async (id: number) => {
	return request<void>(`/vehicles/${id}`, {
		method: 'DELETE'
	});
};
