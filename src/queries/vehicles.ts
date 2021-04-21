import axios, { AxiosInstance } from 'axios';

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
    reminder: string;
}

export function fetchVehicles(api: AxiosInstance) {
    return api.get<Vehicle[]>('/vehicles');
}

//   export function createVehicle(params) {
//     return post('/vehicles', params, CREATE_VEHICLE)
//   }

//   export function fetchVehicle(vehicleId) {
//     return get(`/vehicles/${vehicleId}`, RECEIVE_VEHICLE)
//   }

//   export function updateVehicle(vehicleId, params) {
//     return put(`/vehicles/${vehicleId}`, params, UPDATE_VEHICLE)
//   }

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
