const configureBugsnag = () => {
  if (__DEV__) {
    return {
      notifyException(e) {
        console.log()
      }
    }
  }

  const Bugsnag = require('bugsnag-js')
  Bugsnag.apiKey = '82a824bdf00f1e44c037036452e83579'
  return Bugsnag
}

const Bugsnag = configureBugsnag()

export default (err) => {
  Bugsnag.notifyException(err)
}
