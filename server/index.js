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
  ignorePath: true,
  agent: isProd ? https.globalAgent : false,
  headers: {
    host: url.parse(HOST).hostname
  }
})

var static = express.static(path.join(__dirname, '../public/'), { maxAge: ONE_YEAR })
app.use('/', static)

app.all('/api/*', function(req, res){
  var path = req.path.replace('/api', '')

  apiProxy.web(req, res, {
    target: HOST + path
  })
})

var routes = ['/', '/sessions/:token', '/vehicles', '/vehicles/:id']

var handler = function (req, res) {
  return res.sendFile(path.join(__dirname, '../public/index.html'))
}
routes.forEach(function (route) {
  return app.get(route, handler)
})

app.listen(PORT)

console.log('Magic happens on port ' + PORT)
