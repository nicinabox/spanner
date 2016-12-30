var https     = require('https')
var path      = require('path')
var url       = require('url')
var httpProxy = require('http-proxy')
var express   = require('express')

var isProd   = process.env.NODE_ENV === 'production'
var PORT     = process.env.PORT || 8080
var HOST     = isProd ? 'https://spanner-api.apps.nicinabox.com' : 'http://localhost:3000'

var ONE_YEAR = 31557600000

var app = express()
var apiProxy = httpProxy.createProxyServer({
  xfwd: true,
  ignorePath: true,
  agent: isProd ? https.globalAgent : false,
  headers: {
    host: url.parse(HOST).hostname
  }
})

var remoteIp = function (req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress
}

var static = express.static(path.join(__dirname, '../public/'), { maxAge: ONE_YEAR })
app.use('/', static)

app.all('/api/*', function(req, res){
  var path = req.path.replace('/api', '')

  apiProxy.web(req, res, {
    target: HOST + path,
    headers: {
      'x-forwarded-for': remoteIp(req)
    }
  })
})

app.get('/apple-app-site-association', function (req, res) {
  res.set('Content-Type', 'application/pkcs7-mime')
  res.send(require('./apple-app-site-association.json'))
})

var routes = ['/', '/login/:token', '/vehicles', '/vehicles/:id']

var handler = function (req, res) {
  return res.sendFile(path.join(__dirname, '../public/index.html'))
}
routes.forEach(function (route) {
  return app.get(route, handler)
})

app.listen(PORT)

console.log('Magic happens on port ' + PORT)
