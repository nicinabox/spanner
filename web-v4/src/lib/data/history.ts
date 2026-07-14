import { request } from './server';
import type { RequestOpts } from './types';
import type { Attachment } from './attachments';
import type { Classification } from './classifications';

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
	attachments: Attachment[];
	classifications: Classification[];
}

export interface RecordCreateData {
	date: string;
	notes: string;
	mileage?: number | null;
	cost?: string | null;
	recordType?: string | null;
	classificationIds?: number[];
}

export type RecordUpdateData = Partial<RecordCreateData>;

export const getVehicleHistory = (vehicleId: number | string, opts: RequestOpts) => {
	return request<HistoryEntry[]>(`/vehicles/${vehicleId}/records`, opts);
};

export const getHistoryEntry = (
	vehicleId: number | string,
	id: number | string,
	opts: RequestOpts,
) => {
	return request<HistoryEntry>(`/vehicles/${vehicleId}/records/${id}`, opts);
};

export const createHistoryEntry = (
	vehicleId: number | string,
	data: RecordCreateData,
	opts: RequestOpts,
) => {
	return request<HistoryEntry>(`/vehicles/${vehicleId}/records`, {
		...opts,
		method: 'POST',
		json: data,
	});
};

export const updateHistoryEntry = (
	vehicleId: number | string,
	id: number | string,
	data: RecordUpdateData,
	opts: RequestOpts,
) => {
	return request<HistoryEntry>(`/vehicles/${vehicleId}/records/${id}`, {
		...opts,
		method: 'PUT',
		json: data,
	});
};

export const deleteHistoryEntry = (
	vehicleId: number | string,
	id: number | string,
	opts: RequestOpts,
) => {
	return request<void>(`/vehicles/${vehicleId}/records/${id}`, {
		...opts,
		method: 'DELETE',
	});
};
