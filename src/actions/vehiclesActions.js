import { post, put, get, destroy } from '../utils/httpActions'

export const RECEIVE_VEHICLES = 'RECEIVE_VEHICLES'
export const RECEIVE_VEHICLE = 'RECEIVE_VEHICLE'
export const CREATE_VEHICLE = 'CREATE_VEHICLE'
export const UPDATE_VEHICLE = 'UPDATE_VEHICLE'
export const DESTROY_VEHICLE = 'DESTROY_VEHICLE'

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
