// const path = require('path');
// const webpack = require('webpack');
const slsw = require('serverless-webpack');
const TerserPlugin = require('terser-webpack-plugin');
const nodeExternal = require('webpack-node-externals');

const WEBPACK_BUILD_MODE = ['prod', 'production'].indexOf(process.env.NODE_ENV) > -1 ? 'production' : 'none';

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: WEBPACK_BUILD_MODE,
  optimization: {
    // We no not want to minimize our code.
    minimizer: [new TerserPlugin({
      test: /\.js(\?.*)?$/i,
      cache: true,
      terserOptions: {
        ecma: undefined,
        warnings: false,
        parse: {},
        compress: {
          // drop_console: true,
          pure_funcs: ['console.log', 'console.info', 'console.warn'],
        },
        mangle: true, // Note `mangle.properties` is `false` by default.
        module: false,
        output: null,
        toplevel: false,
        nameCache: null,
        ie8: false,
        keep_classnames: undefined,
        keep_fnames: false,
        safari10: false,
      },
    })],
  },
  performance: {
    // Turn off size warnings for entry points
    hints: false,
  },
  devtool: 'nosources-source-map',
  externals: [nodeExternal()],
  plugins: [
  ],
  module: {
    rules: [
      {
        type: 'javascript/auto',
        test: /\.mjs$/,
        use: [],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['env', {targets: {node: '12.14.1'}, debug: true}]],
              plugins: ['transform-object-rest-spread', 'transform-class-properties'],
              cacheDirectory: true,
            },
          },
        ],
      },
    ],
  },
};
