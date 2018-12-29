import { post, put, get, destroy } from '../utils/httpActions'

export const RECEIVE_REMINDERS = 'RECEIVE_REMINDERS'
export const CREATE_REMINDER = 'CREATE_REMINDER'
export const DESTROY_REMINDER = 'DESTROY_REMINDER'
export const UPDATE_REMINDER = 'UPDATE_REMINDER'
export const ESTIMATE_REMINDER_DATE = 'ESTIMATE_REMINDER_DATE'

export function fetchReminders(vehicleId) {
  return get(`/vehicles/${vehicleId}/reminders`, null, RECEIVE_REMINDERS, {
    vehicleId
  })
}

export function createReminder(vehicleId, reminder) {
  return post(`/vehicles/${vehicleId}/reminders`, reminder, CREATE_REMINDER, {
    vehicleId
  })
}

export function destroyReminder(vehicleId, reminderId) {
  return destroy(`/vehicles/${vehicleId}/reminders/${reminderId}`, null, DESTROY_REMINDER, {
    vehicleId,
    reminderId,
  })
}

export function updateReminder(vehicleId, reminderId, params) {
  return put(`/vehicles/${vehicleId}/reminders/${reminderId}`, params, UPDATE_REMINDER, {
    vehicleId,
    reminderId,
  })
}

export function estimateReminderDate(vehicleId, reminder) {
  return get(
    `/vehicles/${vehicleId}/reminders/estimate_date`,
    { reminder },
    ESTIMATE_REMINDER_DATE,
    { vehicleId }
  )
}
