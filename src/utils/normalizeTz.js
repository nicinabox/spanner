export default (date) => {
  if (/Z$/.test(date)) {
    let offset = new Date().getTimezoneOffset()
    let hours = 1000 * 60 * offset

    return new Date(Date.parse(date) + hours)
  } else {
    return new Date(date)
  }
}
