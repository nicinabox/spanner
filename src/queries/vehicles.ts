import { AxiosInstance } from 'axios';
import { RecordID, MutateParams } from './config';
import { VehicleReminder } from './reminders';

export type DistanceUnit = 'mi' | 'km' | 'hr';

export interface Vehicle {
    id: RecordID;
    name: string;
    vin: string;
    notes: string;
    position: number | null;
    distanceUnit: DistanceUnit;
    retired: boolean;
    createdAt: string;
    milesPerDay: number | null;
    milesPerYear: number | null;
    estimatedMileage: number;
    squishVin: string;
    reminders: VehicleReminder[];
    color: string | null;
    preferences: VehiclePreferences;
}

export interface VehiclePreferences {
    enableCost: boolean;
    sendReminderEmails: boolean;
    sendPromptForRecords: boolean;
}

export interface VehicleParams {
    id?: RecordID;
    name?: string;
    vin?: string;
    notes?: string;
    position?: number;
    enableCost?: boolean;
    distanceUnit?: DistanceUnit;
    retired?: boolean;
    color?: string | null;
    preferences?: Partial<VehiclePreferences>;
}

export const vehiclesAPIPath = '/api/vehicles';
export const vehicleAPIPath = (vehicleId: RecordID) => `/api/vehicles/${vehicleId}`;

export async function fetchVehicles(api: AxiosInstance) {
    const { data } = await api.get<Vehicle[]>(vehiclesAPIPath);
    return data;
}

export async function fetchVehicle(api: AxiosInstance, vehicleId: RecordID) {
    const { data } = await api.get<Vehicle>(vehicleAPIPath(vehicleId));
    return data;
}

export async function updateVehicle(api: AxiosInstance, params: MutateParams<VehicleParams>) {
    const { id, ...updateParams } = params;
    const { data } = await api.put<Vehicle>(vehicleAPIPath(id), updateParams);
    return data;
}

export async function createVehicle(api: AxiosInstance, params: VehicleParams) {
    const { data } = await api.post<Vehicle>(vehiclesAPIPath, params);
    return data;
}

export async function createOrUpdateVehicle(api: AxiosInstance, params: VehicleParams) {
    if (params.id) {
        return updateVehicle(api, params as MutateParams<typeof params>);
    }
    return createVehicle(api, params);
}

export async function destroyVehicle(api: AxiosInstance, vehicleId: RecordID) {
    const { data } = await api.delete(vehicleAPIPath(vehicleId));
    return data;
}

export async function importRecords(api: AxiosInstance, vehicleId: RecordID, params: { importFile: File, fuelly: boolean }) {
    const body = new FormData();
    body.append('vehicle[import_file]', params.importFile);
    body.append('vehicle[fuelly]', `${params.fuelly}`);

    const { data } = await api.post(`${vehicleAPIPath(vehicleId)}/import`, body);
    return data;
}
