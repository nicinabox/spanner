export default store => next => action => {
  let result = next(action)

  if (!action.isError) return

  if (Array.isArray(action.error)) {
    console.log(
      action.error.map((e) => e.title).join('\n')
    )
  } else {
    console.log(action.error)
  }

  return result
}
