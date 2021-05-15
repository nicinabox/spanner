import { AxiosInstance } from 'axios';
import { RecordID } from './config';

export interface VehicleRecord {
    id: number;
    cost: string;
    date: string; // "2019-07-19T04:35:26.370Z"
    mileage: number;
    notes: string;
}

export interface VehicleRecordParams {
    id?: RecordID;
    date: string;
    cost: string | null;
    mileage: number;
    notes: string;
    recordType: 'mileage adjustment' | null;
}

export const vehicleRecordsPath = (vehicleId: RecordID) => `/api/vehicles/${vehicleId}/records`;
export const vehicleRecordPath = (vehicleId: RecordID, recordId: RecordID) => `/api/vehicles/${vehicleId}/records/${recordId}`;

export async function fetchRecords(api: AxiosInstance, vehicleId: RecordID) {
    const { data } = await api.get<VehicleRecord[]>(vehicleRecordsPath(vehicleId));
    return data;
}

export async function fetchRecord(api: AxiosInstance, vehicleId: RecordID, recordId: RecordID) {
    const { data } = await api.get<VehicleRecord>(vehicleRecordPath(vehicleId, recordId));
    return data;
}

export async function createRecord(api: AxiosInstance, vehicleId: RecordID, record: VehicleRecordParams) {
    const { data } = await api.post<VehicleRecord>(vehicleRecordsPath(vehicleId), record);
    return data;
}

export async function updateRecord(api: AxiosInstance, vehicleId: RecordID, recordId: RecordID, record: Partial<VehicleRecordParams>) {
    const { data } = await api.put<VehicleRecord>(vehicleRecordPath(vehicleId, recordId), record);
    return data;
}

export async function createOrUpdateRecord(api: AxiosInstance, vehicleId: RecordID, record: Partial<VehicleRecordParams>) {
    if (record.id) {
        const { id: recordId, ...restRecord } = record;
        return updateRecord(api, vehicleId, recordId, restRecord);
    }
    return createRecord(api, vehicleId, record as VehicleRecordParams);
}
