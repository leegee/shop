const webpack = require('webpack');
const path = require('path');

const config = require('./webpack.base.conf');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

const PUBLIC_PATH = 'http://localhost:8080/';

config.entry = {
  app: [
    'webpack-dev-server/client?http://localhost:8080',
    './src/shop-app.js'
  ]
};

config.devtool = 'source-map';
config.devServer = {
  contentBase: path.resolve(__dirname, 'dist'),
  hot: true
};
config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new SWPrecacheWebpackPlugin(
    {
      cacheId: 'polymer-shop-2.0',
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'service-worker.js',
      minify: true,
      navigateFallback: PUBLIC_PATH + 'index.html',
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    }
  ),
);

module.exports = config;
