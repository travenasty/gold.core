const path = require('path')
const precss = require('precss')
const webpack = require('webpack')

const cssPrefixer = require('autoprefixer')
const cssVars = require('postcss-advanced-variables')
const cssCalc = require('postcss-calc')

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const DIST_PATH = path.resolve('./dist')
const SRC_PATH = path.resolve('./src')
const TMP_PATH = path.resolve('./tmp')

module.exports = {
  context: SRC_PATH,
  devServer: {
    compress: false,
    contentBase: 'dist',
    // devtool: 'source-map',
    headers: {
      'X-Custom-Header': '2016.08.28'
    },
    historyApiFallback: true,
    hot: true,
    inline: true,
    lazy: false,
    noInfo: false,
    // progress: true,
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
    // watch: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  },
  entry: {
    'gold-core': [
      './core.js',
      // 'webpack/hot/dev-server',
      // 'webpack-dev-server/client?http://localhost:7980/'
    ]
  },
  module: {
    // loaders: [
    //   {
    //     test: /\.css$/,
    //     loader: ExtractTextPlugin.extract({
    //       fallback: 'style-loader',
    //       use: 'css-loader!postcss-loader'
    //     })
    //   },
    //   {
    //     test: /\.js?$/,
    //     loader: 'babel',
    //     exclude: /node_modules/
    //   },
    //   {
    //     test: /\.json$/,
    //     loader: 'json-loader'
    //   },
    //   {
    //     test: /\.(png|jpg)$/,
    //     loader: 'url',
    //     query: {
    //       limit: 8192
    //     }
    //   }
    // ],
    rules: [
      { test: /\.(styl|css)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              options: {},
              plugins: [
                cssPrefixer,
                cssVars,
                cssCalc,
                precss
              ]
            }
          }
        ]
      },
      { test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: { presets: ['es2015', 'stage-3'] }
        }]
      },
      { test: /\.json/,
        use: [{
          loader: 'json-loader'
        }]
      },
      { test: /\.(png|jpg)$/,
        use: [{
          loader: 'url-loader'
        }]
      }
    ]
  },
  output: {
    path: DIST_PATH,
    publicPath: '/',
    filename: '[name].bundle.js',
    chunkFilename: "[id].js"
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      disable: false,
      allChunks: true
    }),
    // new webpack.HotModuleReplacementPlugin()
  ],
  recordsPath: TMP_PATH + '/webpack.cache.json',
  resolve: {
    alias: {
      component: SRC_PATH + '/component',
      driver: SRC_PATH + '/driver',
      model: SRC_PATH + '/model',
      page: SRC_PATH + '/page',
      util: SRC_PATH + '/util'
    },
    modules: [
      'node_modules',
      'src/component'
    ]
  }
}
