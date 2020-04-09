const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const PUBLIC_PATH = 'http://localhost:8080/';

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  node: {
    process: true,
    fs: 'empty'
  },
  output: {
    filename: 'shop-app.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  "targets": {
                    "chrome": "58",
                    "ie": "11",
                    "edge": "40"
                  }
                }
              ]
            ],
            plugins: [
              ["@babel/plugin-transform-runtime", {
                "regenerator": true
              }],
              ["@babel/plugin-proposal-object-rest-spread", {
                "loose": true,
                "useBuiltIns": true
              }],

            ],
          }
        }
      },
    ]
  },
  resolve: {
    extensions: [
      '.ts', '.js', '.html'
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
        from: path.resolve(__dirname, './src/paypal.html'),
        to: '.'
      },
      {
        from: path.resolve(__dirname, './images'),
        to: 'images'
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
  ]
};

