export default store => next => action => {
  let result

  if (__DEV__) {
    console.group(action.type)
    console.info('dispatching', action)

    result = next(action)

    console.log('next state', store.getState())
    console.groupEnd(action.type)
  } else {
    result = next(action)
  }

  return result
}
