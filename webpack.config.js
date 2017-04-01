const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

let plugins = [
  new webpack.HotModuleReplacementPlugin(),
]

if (isProduction) {
  plugins = [
    new LodashModuleReplacementPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
  ]
}

module.exports = {
  devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
  entry: (isProduction ? [] : [
    'webpack-dev-server/client?http://localhost:8079',
    'webpack/hot/dev-server',
  ]).concat([
    './src/index.js',
  ]),
  output: {
    path: path.join(__dirname, './public'),
    filename: 'bundle.js',
    publicPath: isProduction ? '/' : 'http://localhost:8079/',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader'),
      },
      { test: /\.woff2?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
      { test: /\.ttf$/, loader: 'file-loader' },
      { test: /\.eot$/, loader: 'file-loader' },
      { test: /\.svg$/, loader: 'file-loader' },
      { test: /\.(jpg|png)$/, loader: 'url-loader' }
    ]
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      },
      '__DEV__': !isProduction
    })
  ].concat(plugins)
}
