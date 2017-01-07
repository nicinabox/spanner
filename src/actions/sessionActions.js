import { post, put, get, destroy } from '../utils/httpActions'

export const REQUEST_SESSION = 'REQUEST_SESSION'
export const SIGN_IN = 'SIGN_IN'
export const SIGN_OUT = 'SIGN_OUT'
export const DESTROY_SESSION = 'DESTROY_SESSION'
export const RESET_SESSION = 'RESET_SESSION'
export const UPDATE_USER = 'UPDATE_USER'
export const RECEIVE_SESSIONS = 'RECEIVE_SESSIONS'

export function fetchSessions() {
  return get('/sessions', RECEIVE_SESSIONS)
}

export function requestSession (email) {
  return post('/sessions', { email }, REQUEST_SESSION)
}

export function signIn(token) {
  return get(`/login/${token}`, SIGN_IN)
}

export function signOut(session) {
  return destroy(`/sessions/${session.id}`, SIGN_OUT)
}

export function destroySession(session) {
  return destroy(`/sessions/${session.id}`, DESTROY_SESSION)
}

export function resetSession() {
  return { type: RESET_SESSION }
}

export function updateUser(params) {
  return put('/user', params, UPDATE_USER)
}
