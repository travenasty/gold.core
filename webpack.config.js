const path = require('path')

module.exports = {
  entry: './src/core.js',
  output: {
    path: require("path").resolve("./dist"),
    library: '[name]',
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
        loader: "json-loader"
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
