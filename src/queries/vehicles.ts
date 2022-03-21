import { AxiosInstance } from 'axios';
import { MutateParams } from './config';

export interface VehicleParams {
    id?: API.RecordID;
    name?: string;
    vin?: string;
    notes?: string;
    position?: number;
    enableCost?: boolean;
    distanceUnit?: API.DistanceUnit;
    retired?: boolean;
    color?: string | null;
    preferences?: Partial<API.VehiclePreferences>;
}

export const vehiclesAPIPath = '/api/vehicles';
export const vehicleAPIPath = (vehicleId: API.RecordID, share?: boolean) => `/api/vehicles/${vehicleId}${share ? '/share' : ''}`;

export async function fetchVehicles(api: AxiosInstance) {
    const { data } = await api.get<API.Vehicle[]>(vehiclesAPIPath);
    return data;
}

export async function fetchVehicle(api: AxiosInstance, vehicleId: API.RecordID) {
    const { data } = await api.get<API.Vehicle>(vehicleAPIPath(vehicleId));
    return data;
}

export async function updateVehicle(api: AxiosInstance, params: MutateParams<VehicleParams>) {
    const { id, ...updateParams } = params;
    const { data } = await api.put<API.Vehicle>(vehicleAPIPath(id), updateParams);
    return data;
}

export async function createVehicle(api: AxiosInstance, params: VehicleParams) {
    const { data } = await api.post<API.Vehicle>(vehiclesAPIPath, params);
    return data;
}

export async function createOrUpdateVehicle(api: AxiosInstance, params: VehicleParams) {
    if (params.id) {
        return updateVehicle(api, params as MutateParams<typeof params>);
    }
    return createVehicle(api, params);
}

export async function destroyVehicle(api: AxiosInstance, vehicleId: API.RecordID) {
    const { data } = await api.delete(vehicleAPIPath(vehicleId));
    return data;
}

export async function importRecords(api: AxiosInstance, vehicleId: API.RecordID, params: { importFile: File, fuelly: boolean }) {
    const body = new FormData();
    body.append('vehicle[import_file]', params.importFile);
    body.append('vehicle[fuelly]', `${params.fuelly}`);

    const { data } = await api.post(`${vehicleAPIPath(vehicleId)}/import`, body);
    return data;
}
