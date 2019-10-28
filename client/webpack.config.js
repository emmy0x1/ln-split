require("dotenv").config();
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DotenvPlugin = require("dotenv-webpack");
const webpack = require("webpack");
const path = require("path");

const clientDir = path.resolve(__dirname);

module.exports = {
  mode: "development",
  entry: path.join(clientDir, "index.js"),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          {
            loader: "postcss-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new DotenvPlugin({ path: ".env", systemvars: true }),
    new HtmlWebpackPlugin({
      template: `${clientDir}/index.html`,
      inject: true
    })
  ],
  resolve: {
    modules: [clientDir, path.join(__dirname, "../node_modules")]
  },
  devServer: {
    port: 3001,
    hot: true,
    stats: "minimal"
  }
};
