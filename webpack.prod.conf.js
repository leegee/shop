const config = require('./webpack.dev.conf');

const webpack = require('webpack');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

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

config.optimization = {
  minimizer: [
    new TerserPlugin({
      terserOptions: {
        sourceMap: false,
        extractComments: 'all',
        compress: {
          drop_console: true
        }
      }
    })
  ]
};

module.exports = config;
