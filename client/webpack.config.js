var config = {
  entry: './index.js',

  output: {
    path: 'build/',
    filename: 'index.js',
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ["babel-loader"],
      }
    ]
  }
}

module.exports = config;