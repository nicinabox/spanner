export const RECEIVE_URL = 'RECEIVE_URL'
export const CLEAR_URL = 'CLEAR_URL'

export function receiveUrl(url) {
  return {
    type: RECEIVE_URL,
    url: url,
  }
}

export function clearAppUrl() {
  return {
    type: CLEAR_URL
  }
}
