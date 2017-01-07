const https = require('https')
const url = require('url')
const proxy = require('http-proxy-middleware')

const isProd = process.env.NODE_ENV === 'production'

const PROXY_HOST = isProd
  ? 'https://spanner-api.apps.nicinabox.com'
  : 'http://localhost:3000'

module.exports = proxy({
  target: PROXY_HOST,
  pathRewrite: (path, req) => {
    let nextPath = path.replace('/api', '')
    console.log(req.method, nextPath) // eslint-disable-line

    return nextPath
  },
  agent: isProd ? https.globalAgent : false,
  headers: {
    host: url.parse(PROXY_HOST).hostname
  }
})
