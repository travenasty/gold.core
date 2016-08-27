const path = require('path')
const webpack = require('webpack')

const DIST_PATH = path.resolve('./dist')
const SRC_PATH = path.resolve('./src')
const TMP_PATH = path.resolve('./tmp')

module.exports = {
  context: SRC_PATH,
  devServer: {
    compress: false,
    contentBase: 'dist',
    devtool: 'source-map',
    filename: '[name].bundle.js',
    headers: {
      'X-Custom-Header': '2016.08.26'
    },
    historyApiFallback: false,
    hot: true,
    inline: true,
    lazy: true,
    noInfo: false,
    progress: true,
    proxy: {
      '/horizon/*': {
        target: 'http://localhost:8181',
        secure: false
      },
    },
    publicPath: '/',
    quiet: false,
    setup: function(app) {
      // Customize the Express app object middleware, etc.
    },
    stats: { colors: true },
    watch: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  },
  entry: {
    'gold-core': [
      './core.js',
      'webpack/hot/dev-server',
      'webpack-dev-server/client?http://localhost:7980/'
    ]
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
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
  },
  output: {
    path: DIST_PATH,
    publicPath: '/',
    filename: '[name].bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  recordsPath: TMP_PATH + '/webpack.cache.json',
  resolve: {
    alias: {
      util: SRC_PATH + '/util'
    }
  }
}
