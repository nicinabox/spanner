import captureException from '../utils/captureException'
import { setItem } from '../utils/storage'

export default store => next => action => {
  let result = next(action)

  setItem('store', store.getState() || {})
    .catch(captureException)

  return result
}
