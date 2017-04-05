import Flash from '../components/Flash'

export default store => next => action => {
  let result = next(action)

  if (!action.isError) return

  Flash.close()

  if (Array.isArray(action.error)) {
    Flash.open({
      message: action.error.map((e) => e.title).join('\n')
    })
  } else {
    Flash.open({
      message: action.error
    })
  }

  return result
}
