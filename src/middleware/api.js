import { snakeCase, camelCase, isObjectLike, isDate, isArray } from 'lodash'
import config from '../config'
import http from '../utils/http'

const API_VERSION = 2

const getTimeZoneOffset = () => {
  return new Date().getTimezoneOffset() / 60 * -1
}

const snakeCaseKeys = (obj) => {
  if (!obj) return

  if (isArray(obj)) {
    return obj.map(snakeCaseKeys)
  }

  if (isDate(obj)) {
    return obj
  }

  return Object.keys(obj).reduce((r, k) => {
    return {
      ...r,
      [snakeCase(k)]: isObjectLike(obj[k]) ? snakeCaseKeys(obj[k]) : obj[k]
    }
  }, {})
}

const camelCaseKeys = (obj) => {
  if (!obj) return

  if (isArray(obj)) {
    return obj.map(camelCaseKeys)
  }

  return Object.keys(obj).reduce((r, k) => {
    return {
      ...r,
      [camelCase(k)]: isObjectLike(obj[k]) ? camelCaseKeys(obj[k]) : obj[k]
    }
  }, {})
}

export default store => next => action => {
  if (typeof action.types === 'undefined' || typeof action.method === 'undefined') {
    return next(action)
  }

  let { types, path, method = 'get', params, body, headers } = action
  const hasFormData = body instanceof FormData
  const [PENDING, SUCCESS, ERROR] = types
  const { session } = store.getState()

  const url = (path.indexOf('/') === 0) ? [config.host, '/api', path].join('') : path

  let options = {
    headers: {
      Accept: `application/vnd.api+json; version=${API_VERSION}`,
      Authorization: `Token ${session.authToken}`,
      'Time-Zone-Offset': getTimeZoneOffset(),
      ...headers
    },
    body: hasFormData ? body : JSON.stringify(snakeCaseKeys(body)),
    params: snakeCaseKeys(params),
    method: method.toUpperCase(),
  }

  if (!hasFormData) {
    options.headers['Content-Type'] = 'application/json'
  }

  let req = http(url, options)

  next({
    type: PENDING,
    isPending: true,
    params: hasFormData ? params : body || params,
  })

  req
    .then((respBody) => {
      next({
        type: SUCCESS,
        isPending: false,
        params: hasFormData ? params : body || params,
        body: Array.isArray(respBody) ? respBody.map(camelCaseKeys) : camelCaseKeys(respBody),
      })
    })
    .catch((error) => {
      if (error.status === 401 && session.authToken) {
        return next({
          type: 'SIGN_OUT_PENDING',
          ...error
        })
      }

      let errorMessage = error instanceof Error
        ? error.message
        : error.body.error || error.body.errors

      errorMessage = errorMessage || error.body

      next({
        type: ERROR,
        isError: true,
        isPending: false,
        params: body || params,
        error: errorMessage
      })
    })

  return req
}
