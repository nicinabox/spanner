import { AxiosInstance } from 'axios';

export interface Vehicle {
    id: number;
    name: string;
    vin: string;
    notes: string;
    position: number;
    enableCost: boolean;
    distanceUnit: 'mi' | 'km';
    retired: boolean;
    createdAt: string;
    milesPerDay: number;
    milesPerYear: number;
    estimatedMileage: number;
    squishVin: number;
    reminders: string;
}

interface VehicleParams {
    name: string;
    vin: string;
    notes: string;
    position: number;
    enable_cost: boolean;
    distance_unit: 'mi' | 'km';
    retired: boolean;
}

export function fetchVehicles(api: AxiosInstance) {
    return api.get<Vehicle[]>('/vehicles');
}

export function fetchVehicle(api: AxiosInstance, vehicleId: string) {
    return api.get<Vehicle>(`/vehicles/${vehicleId}`);
}

export function updateVehicle(api: AxiosInstance, vehicleId: number, params: Partial<VehicleParams>) {
    return api.put(`/vehicles/${vehicleId}`, params);
}

export function createVehicle(api: AxiosInstance, params: VehicleParams) {
    return api.post('/vehicles', params);
}

//   export function destroyVehicle(vehicleId) {
//     return destroy(`/vehicles/${vehicleId}`, DESTROY_VEHICLE)
//   }

//   export function exportRecords(vehicleId) {
//     return get(`/vehicles/${vehicleId}/export`, EXPORT_VEHICLE)
//   }

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
