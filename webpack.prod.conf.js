const config = require('./webpack.dev.conf');

const webpack = require('webpack');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

const PUBLIC_PATH = '';

delete config.devtool;

config.entry = {
  main: './src/shop-app.js'
};

config.plugins.push(
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
