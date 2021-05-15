import { AxiosInstance } from 'axios';

export interface VehicleRecord {
    cost: string;
    date: string; // "2019-07-19T04:35:26.370Z"
    id: number;
    mileage: number;
    notes: string;
}

export interface VehicleRecordParams {
    date: string;
    cost: string | null;
    mileage: number;
    notes: string;
    recordType: 'mileage adjustment' | null;
}

export const vehicleRecordsPath = (vehicleId: string | number) => `/api/vehicles/${vehicleId}/records`;
export const vehicleRecordPath = (vehicleId: string | number, recordId: string | number) => `/api/vehicles/${vehicleId}/records/${recordId}`;

export async function fetchRecords(api: AxiosInstance, vehicleId: number | string) {
    const { data } = await api.get<VehicleRecord[]>(vehicleRecordsPath(vehicleId));
    return data;
}

export async function fetchRecord(api: AxiosInstance, vehicleId: number | string, recordId: number | string) {
    const { data } = await api.get<VehicleRecord>(vehicleRecordPath(vehicleId, recordId));
    return data;
}

export async function createRecord(api: AxiosInstance, vehicleId: number | string, record: VehicleRecordParams) {
    const { data } = await api.post<VehicleRecord>(vehicleRecordsPath(vehicleId), record);
    return data;
}
