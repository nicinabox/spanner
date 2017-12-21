const https = require('https')
const url = require('url')
const proxy = require('http-proxy-middleware')

const { NODE_ENV, PROXY_HOST } = process.env
const isProd = NODE_ENV === 'production'

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
