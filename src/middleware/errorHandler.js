export default store => next => action => {
  let result = next(action)

  if (!action.isError) return

  if (Array.isArray(action.error)) {
    alert(
      action.error.map((e) => e.title).join('\n')
    )
  } else {
    alert(action.error)
  }

  return result
}
