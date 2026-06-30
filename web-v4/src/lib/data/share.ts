import { request } from './server';
import type { Vehicle } from './vehicles';
import type { HistoryEntry } from './history';

export const getSharedVehicle = (id: number | string) => {
	return request<Vehicle>(`/vehicles/${id}/share`);
};

export const getSharedVehicleHistory = (id: number | string) => {
	return request<HistoryEntry[]>(`/vehicles/${id}/records/share`);
};
