import { createAPIRequest } from './client';
import { apiConfig } from './config';
import type { Vehicle } from './vehicles';
import type { HistoryEntry } from './history';

// Public API client — no auth headers for share endpoints
const publicRequest = createAPIRequest({
	...apiConfig,
	authHeaderValue: () => undefined,
});

export const getSharedVehicle = (id: number | string) => {
	return publicRequest<Vehicle>(`/vehicles/${id}/share`);
};

export const getSharedVehicleHistory = (id: number | string) => {
	return publicRequest<HistoryEntry[]>(`/vehicles/${id}/records/share`);
};
