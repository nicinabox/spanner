import { AxiosInstance } from 'axios';
import { RecordID, MutateParams } from './config';

type RecordType = 'mileage adjustment' | null;

export interface VehicleRecord {
    id: number;
    cost: string;
    date: string; // "2019-07-19T04:35:26.370Z"
    mileage: number;
    notes: string;
    createdAt: string;
    updatedAt: string;
    recordType?: RecordType;
}

export interface VehicleRecordParams {
    id?: RecordID;
    date?: string;
    cost?: string | null;
    mileage?: number;
    notes?: string;
    recordType?: RecordType;
}

export const recordsAPIPath = (vehicleId: RecordID, share?: boolean) => `/api/vehicles/${vehicleId}/records${share ? '/share' : ''}`;
export const recordAPIPath = (vehicleId: RecordID, recordId: RecordID) => `/api/vehicles/${vehicleId}/records/${recordId}`;

export async function fetchRecords(api: AxiosInstance, vehicleId: RecordID) {
    const { data } = await api.get<VehicleRecord[]>(recordsAPIPath(vehicleId));
    return data;
}

export async function fetchRecord(api: AxiosInstance, vehicleId: RecordID, recordId: RecordID) {
    const { data } = await api.get<VehicleRecord>(recordAPIPath(vehicleId, recordId));
    return data;
}

export async function createRecord(api: AxiosInstance, vehicleId: RecordID, record: VehicleRecordParams) {
    const { data } = await api.post<VehicleRecord>(recordsAPIPath(vehicleId), record);
    return data;
}

export async function updateRecord(api: AxiosInstance, vehicleId: RecordID, record: MutateParams<VehicleRecordParams>) {
    const { data } = await api.put<VehicleRecord>(recordAPIPath(vehicleId, record.id), record);
    return data;
}

export async function destroyRecord(api: AxiosInstance, vehicleId: RecordID, recordId: RecordID) {
    const { data } = await api.delete(recordAPIPath(vehicleId, recordId));
    return data;
}

export async function createOrUpdateRecord(api: AxiosInstance, vehicleId: RecordID, params: VehicleRecordParams) {
    if (params.id) {
        return updateRecord(api, vehicleId, params as MutateParams<typeof params>);
    }
    return createRecord(api, vehicleId, params);
}
