const serialize = (json) => {
  return JSON.stringify(json)
}

const deserialize = (str) => {
  try {
    return JSON.parse(str)
  } catch (e) {
    return str
  }
}

const promisify = (fn, binding) => (...args) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(fn.apply(binding || null, args))
    } catch (e) {
      reject(e)
    }
  })
}

const AsyncLocalStorage = {
  getItem: promisify(localStorage.getItem, localStorage),
  setItem: promisify(localStorage.setItem, localStorage),
  clearItem: promisify(localStorage.clearItem, localStorage),
}

export const getItem = (key) => {
  return AsyncLocalStorage.getItem(key).then(deserialize)
}

export const setItem = (key, value) => {
  return AsyncLocalStorage.setItem(key, serialize(value))
}

export const clear = (key) => {
  return AsyncLocalStorage.clearItem(key)
}
