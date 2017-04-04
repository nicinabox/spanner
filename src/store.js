import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import api from './middleware/api'
import cache from './middleware/cache'
import errorHandler from './middleware/errorHandler'
import logger from './middleware/logger'
import reducers from './reducers'

const enhancer = compose(
  applyMiddleware(
    thunk,
    api,
    errorHandler,
    cache,
    logger
  ),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
export default (initialState) => {
  let store = createStore(reducers, initialState, enhancer)

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./reducers/index').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
