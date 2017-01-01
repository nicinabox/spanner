const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('../webpack.config.js')

const server = new WebpackDevServer(webpack(config), {
  contentBase: 'public',
  hot: true,
  quiet: false,
  noInfo: false,
  publicPath: '/',
  stats: { colors: true }
})

module.exports = server
