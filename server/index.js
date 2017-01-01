const path = require('path')
const express = require('express')
const apiProxy = require('./api-proxy')

const PORT = process.env.PORT || 8081
const ONE_YEAR = 31557600000

const app = express()

const handler = (filename) => (req, res) => res.sendFile(path.join(__dirname, `../public/${filename}.html`))

app.use('/', express.static(path.join(__dirname, '../public/'), { maxAge: ONE_YEAR }))

app.all('/api/*', (req, res) => {
  apiProxy.server.web(req, res, {
    target: apiProxy.PROXY_HOST + req.path.replace('/api', '')
  })
})

app.get('/apple-app-site-association', (req, res) => {
  res.set('Content-Type', 'application/pkcs7-mime')
  res.send(require('./apple-app-site-association.json'))
})

const routes = ['/', '/sessions/:token', '/vehicles', '/vehicles/:id']
routes.forEach((route) => app.get(route, handler('index')))

app.listen(PORT)

console.log('Magic happens on port ' + PORT) // eslint-disable-line
