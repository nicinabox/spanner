const isResponseType = (resp, type) => {
  let contentType = resp.headers.get('content-type')
  return !contentType || contentType.includes(type)
}

const extractBody = (resp) => {
  if (isResponseType(resp, 'text/plain')) return resp.text()
  if (isResponseType(resp, 'application/json')) return resp.json()
  if (isResponseType(resp, 'application/vnd.api+json')) return resp.json()
  if (isResponseType(resp)) return {}

  return resp
}

const checkStatus = (resp) => {
  if (resp.ok) return resp

  const body = extractBody(resp)
  return Promise.reject({
    status: resp.status,
    body
  })
}

export default (url, options = {}) => {
  return fetch(url, options)
    .then(checkStatus)
    .then(extractBody)
}
