const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  devtool: 'cheap-eval-source-map',
  entry: [
    './src/index.js',
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8079'
  ],
  export: {
    path: 'public',
    filename: 'bundle.js'
  },
  output: {
    path: '/',
    publicPath: 'http://localhost:8079/',
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      },
      '__DEV__': process.env.NODE_ENV !== 'production'
    })
  ]
}
