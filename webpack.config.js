module.exports = {
  entry: 'server.js',
  output: {
    path: './dist',
    filename: 'gold.bundle.js',
    publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        loaders: [
          'babel'
        ],
        include: 'server.js',
        query: {
          presets: [
            'es2015'
          ]
        }
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
        loaders: [
          'url'
        ],
        query: {
          limit: 8192
        }
      }
    ]
  }
}