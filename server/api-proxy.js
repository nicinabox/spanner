const https = require('https')
const url = require('url')
const httpProxy = require('http-proxy')

const isProd = process.env.NODE_ENV === 'production'

const PROXY_HOST = isProd
  ? 'https://spanner-api.apps.nicinabox.com'
  : 'http://localhost:3000'

exports.PROXY_HOST = PROXY_HOST

exports.server = httpProxy.createProxyServer({
  ignorePath: true,
  agent: isProd ? https.globalAgent : false,
  headers: {
    host: url.parse(PROXY_HOST).hostname
  }
})
