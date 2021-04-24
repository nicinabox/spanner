import { AxiosInstance } from "axios";

export interface VehicleRecord {
    cost: string;
    date: string; //"2019-07-19T04:35:26.370Z"
    id: number;
    mileage: number;
    notes: string;
}

export interface VehicleRecordParams {
    date: string;
    cost?: string;
    mileage: number;
    notes: string;
    recordType?: 'mileage adjustment';
}

export function fetchRecords(api: AxiosInstance, vehicleId: number) {
    return api.get(`/vehicles/${vehicleId}/records`);
}

export function createRecord(api: AxiosInstance, vehicleId: number, record: VehicleRecordParams) {
    return api.post(`/vehicles/${vehicleId}/records`, record)
}
