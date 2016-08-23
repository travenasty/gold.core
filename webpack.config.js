const path = require('path')

module.exports = {
  devServer: {
    contentBase: path.resolve('./dist'),
    historyApiFallback: true,
    proxy: {
      '/horizon/*': {
        target: 'http://localhost:8181',
        secure: false
      },
    },
    hot: true,
    historyApiFallback: false,
    compress: false,

    setup: function(app) {
      // Customize the Express app object middleware, etc.
    },

    // webpack-dev-middleware options
    quiet: false,
    noInfo: false,
    lazy: true,
    filename: '[name].bundle.js',
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    publicPath: '/assets/',
    headers: { 'X-Custom-Header': '2016.08.22' },
    stats: { colors: true }
  },
  entry: './src/core.js',
  output: {
    path: require('path').resolve('./dist'),
    publicPath: '/assets/',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: [
            'es2015'
          ]
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        loaders: [
          'style',
          'css',
          'postcss'
        ]
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url',
        query: {
          limit: 8192
        }
      }
    ]
  }
}
