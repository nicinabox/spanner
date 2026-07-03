import { request } from './server';
import type { Vehicle } from './vehicles';
import type { HistoryEntry } from './history';

export const getSharedVehicle = (token: string) => {
	return request<Vehicle>(`/share/vehicles/${token}`);
};

export const getSharedVehicleHistory = (token: string) => {
	return request<HistoryEntry[]>(`/share/vehicles/${token}/records`);
};
