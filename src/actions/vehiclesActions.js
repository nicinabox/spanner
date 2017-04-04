import { post, put, get, destroy, createActionTypes } from '../utils/httpActions'

export const RECEIVE_VEHICLES = 'RECEIVE_VEHICLES'
export const RECEIVE_VEHICLE = 'RECEIVE_VEHICLE'
export const CREATE_VEHICLE = 'CREATE_VEHICLE'
export const UPDATE_VEHICLE = 'UPDATE_VEHICLE'
export const DESTROY_VEHICLE = 'DESTROY_VEHICLE'
export const EXPORT_VEHICLE = 'EXPORT_VEHICLE'
export const IMPORT_VEHICLE = 'IMPORT_VEHICLE'

export function fetchVehicles() {
  return get('/vehicles', RECEIVE_VEHICLES)
}

export function createVehicle(params) {
  return post('/vehicles', params, CREATE_VEHICLE)
}

export function fetchVehicle(vehicleId) {
  return get(`/vehicles/${vehicleId}`, RECEIVE_VEHICLE)
}

export function updateVehicle(vehicleId, params) {
  return put(`/vehicles/${vehicleId}`, params, UPDATE_VEHICLE)
}

export function destroyVehicle(vehicleId) {
  return destroy(`/vehicles/${vehicleId}`, DESTROY_VEHICLE)
}

export function exportRecords(vehicleId) {
  return get(`/vehicles/${vehicleId}/export`, EXPORT_VEHICLE)
}

export function importRecords(vehicleId, params) {
  let data = new FormData()
  data.append('vehicle[import_file]', params.importFile)
  data.append('vehicle[fuelly]', params.fuelly)

  return (dispatch) => dispatch({
    types: createActionTypes(IMPORT_VEHICLE),
    type: IMPORT_VEHICLE,
    path: `/vehicles/${vehicleId}/import`,
    method: 'POST',
    body: data,
    params: {
      vehicleId
    }
  })
}
