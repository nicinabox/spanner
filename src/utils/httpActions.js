import { chunk } from 'lodash'

export const PENDING = '_PENDING'
export const SUCCESS = '_SUCCESS'
export const ERROR   = '_ERROR'

export const createActionTypes = (type) => {
  return [PENDING, SUCCESS, ERROR].map(suffix => type.toUpperCase() + suffix)
}

export const getPathFragments = (path) => {
  return chunk(path.split('/').filter(f => f), 2)
}

const toSingular = (str) => {
  if (/s$/.test(str)) {
    return str.substring(0, str.length - 1)
  }

  return str
}

const getResourceIds = (method, path) => {
  return getPathFragments(path).reduce((result, [fragment, id]) => {
    if (!id) return result

    return {
      ...result,
      [toSingular(fragment) + 'Id']: +id
    }
  }, {})
}

const createHttpAction = (method) => (path, params, type) => {
  if (typeof params === 'string') {
    type = params
    params = null
  }

  const bodyOrParams = method === 'get' ? 'params' : 'body'
  const ids = getResourceIds(method, path)

  return dispatch => dispatch({
    types: createActionTypes(type),
    type,
    method,
    path,
    [bodyOrParams]: {
      ...params,
      ...ids
    }
  })
}

export const get = createHttpAction('get')
export const put = createHttpAction('put')
export const post = createHttpAction('post')
export const destroy = createHttpAction('delete')
