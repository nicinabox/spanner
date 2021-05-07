import { AxiosInstance } from 'axios';
import { VehicleReminder } from './reminders';

export interface Vehicle {
    id: number;
    name: string;
    vin: string;
    notes: string;
    position: number | null;
    enableCost: boolean;
    distanceUnit: 'mi' | 'km';
    retired: boolean;
    createdAt: string;
    milesPerDay: number | null;
    milesPerYear: number | null;
    estimatedMileage: number;
    squishVin: string;
    reminders: VehicleReminder[];
    color: string | null;
}

interface VehicleParams {
    name: string;
    vin: string;
    notes: string;
    position: number;
    enableCost: boolean;
    distanceUnit: 'mi' | 'km';
    retired: boolean;
    color: string | null;
}

export const vehiclesPath = '/api/vehicles';
export const vehiclePath = (vehicleId: number | string) => `/api/vehicles/${vehicleId}`;

export async function fetchVehicles(api: AxiosInstance) {
    const { data } = await api.get<Vehicle[]>(vehiclesPath);
    return data;
}

export async function fetchVehicle(api: AxiosInstance, vehicleId: string) {
    const { data } = await api.get<Vehicle>(vehiclePath(vehicleId));
    return data;
}

export async function updateVehicle(api: AxiosInstance, vehicleId: number, params: Partial<VehicleParams>) {
    const { data } = await api.put(vehiclePath(vehicleId), params);
    return data;
}

export async function createVehicle(api: AxiosInstance, params: VehicleParams) {
    const { data } = await api.post(vehiclesPath, params);
    return data;
}

export async function destroyVehicle(api: AxiosInstance, vehicleId: number) {
    const { data } = await api.delete(vehiclePath(vehicleId));
    return data;
}

//   export function importRecords(vehicleId, params) {
//     let data = new FormData()
//     data.append('vehicle[import_file]', params.importFile)
//     data.append('vehicle[fuelly]', params.fuelly)

//     return (dispatch) => dispatch({
//       types: createActionTypes(IMPORT_VEHICLE),
//       type: IMPORT_VEHICLE,
//       path: `/vehicles/${vehicleId}/import`,
//       method: 'POST',
//       body: data,
//       params: {
//         vehicleId
//       }
//     })
//   }
