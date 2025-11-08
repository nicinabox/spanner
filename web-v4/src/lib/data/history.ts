import { createAPIRequest, type RequestOpts } from './client';

export type HistoryEntryType = 'mileage adjustment';

export interface HistoryEntry {
	id: number;
	vehicleId: number;
	date: string;
	cost: string | null;
	mileage: number | null;
	notes: string;
	createdAt: string;
	updatedAt: string;
	recordType: HistoryEntryType | null;
}

const request = createAPIRequest();

export const getVehicleHistory = (vehicleId: number | string, opts: RequestOpts) => {
	return request<HistoryEntry[]>(`/vehicles/${vehicleId}/records`, opts);
};

export const getHistoryEntry = (vehicleId: number | string, id: number, opts: RequestOpts) => {
	return request<HistoryEntry>(`/vehicles/${vehicleId}/records/${id}`, opts);
};

export const createHistoryEntry = (
	vehicleId: number | string,
	data: Partial<HistoryEntry>,
	opts: RequestOpts
) => {
	return request<HistoryEntry>(`/vehicles/${vehicleId}/records`, {
		...opts,
		method: 'POST',
		body: JSON.stringify(data)
	});
};

export const updateHistoryEntry = (
	vehicleId: number | string,
	id: number,
	data: Partial<HistoryEntry>,
	opts: RequestOpts
) => {
	return request<HistoryEntry>(`/vehicles/${vehicleId}/records/${id}`, {
		...opts,
		method: 'PUT',
		body: JSON.stringify(data)
	});
};

export const deleteHistoryEntry = (vehicleId: number | string, id: number, opts: RequestOpts) => {
	return request<void>(`/vehicles/${vehicleId}/records/${id}`, {
		...opts,
		method: 'DELETE'
	});
};
