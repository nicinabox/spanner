const path = require('path')
const express = require('express')
const proxy = require('http-proxy-middleware')
const apiProxy = require('./api-proxy')

const isProduction = process.env.NODE_ENV === 'production'
const PORT = process.env.PORT || 8080
const ONE_YEAR = 31557600000

const app = express()

const assetProxy = proxy({
  target: `http://localhost:${PORT - 1}`,
  changeOrigin: true
})

const handler = (filename) => (req, res) => res.sendFile(path.join(__dirname, `../public/${filename}.html`))

app.use('/', express.static(path.join(__dirname, '../public/'), { maxAge: ONE_YEAR }))
app.use('/bundle.js*', assetProxy)

app.all('/api/*', (req, res) => {
  console.log('API request', req.path);
  apiProxy.server.web(req, res, {
    target: apiProxy.PROXY_HOST + req.path.replace('/api', '')
  })
})

app.get('/*', handler('index'))

app.get('/apple-app-site-association', (req, res) => {
  res.set('Content-Type', 'application/pkcs7-mime')
  res.send(require('./apple-app-site-association.json'))
})

if (isProduction) {
  app.listen(PORT)
} else {
  const webpack = require('./webpack')
  webpack.listen(PORT - 1, 'localhost', () => {})
  app.listen(PORT)
}

console.log('Magic happens on port ' + PORT) // eslint-disable-line
