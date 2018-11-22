const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

const PUBLIC_PATH = 'http://localhost:8080/';

module.exports = {
  mode: 'development',
  node: {
    process: true,
    fs: 'empty'
  },
  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:8080',
      './src/shop-app.js'
    ]
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    hot: true
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '..', 'dist')
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      // {
      //   test: /\.txt$/,
      //   use: 'raw-loader'
      // },
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [
      '.ts', '.js', '.html' // , '.txt'
    ]
  },
  plugins: [
    new Dotenv(),
    new CleanWebpackPlugin(['dist'], {
      verbose: true,
      root: path.resolve(__dirname)
    }),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './manifest.json'),
        to: '.'
      },
      {
        from: path.resolve(__dirname, './images'),
        to: 'images'
      },
      {
        from: path.resolve(__dirname, './data'),
        to: 'data'
      },
      {
        from: path.join(
          path.resolve(__dirname, './node_modules/@webcomponents/webcomponentsjs/'),
          '*.js'
        ),
        to: './webcomponentjs',
        flatten: true
      }
    ]),
    new webpack.IgnorePlugin(/vertx/),
    new webpack.HotModuleReplacementPlugin(),
    new SWPrecacheWebpackPlugin(
      {
        cacheId: 'judit-shop',
        dontCacheBustUrlsMatching: /\.\w{8}\./,
        filename: 'service-worker.js',
        minify: true,
        navigateFallback: PUBLIC_PATH + 'index.html',
        staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
      }
    ),
  ]
};