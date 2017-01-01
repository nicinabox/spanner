import { post, put, get, destroy } from '../utils/httpActions'

export const RECEIVE_RECORDS = 'RECEIVE_RECORDS'
export const CREATE_RECORD = 'CREATE_RECORD'
export const DESTROY_RECORD = 'DESTROY_RECORD'
export const UPDATE_RECORD = 'UPDATE_RECORD'

export function fetchRecords(vehicleId) {
  return get(`/vehicles/${vehicleId}/records`, RECEIVE_RECORDS)
}

export function createRecord(vehicleId, record) {
  return post(`/vehicles/${vehicleId}/records`, record, CREATE_RECORD)
}

export function destroyRecord(vehicleId, recordId) {
  return destroy(`/vehicles/${vehicleId}/records/${recordId}`, DESTROY_RECORD)
}

export function updateRecord(vehicleId, recordId, params) {
  return put(`/vehicles/${vehicleId}/records/${recordId}`, params, UPDATE_RECORD)
}
