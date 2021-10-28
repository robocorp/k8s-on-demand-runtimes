/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const slsw = require('serverless-webpack');
const webpack = require('webpack');

module.exports = {
  entry: slsw.lib.entries,
  devtool: 'inline-source-map',
  externals: [/aws-sdk/], // XXX: this now relies on whatever version of AWS SDK is present in Lambda environment
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.ts',
      '.tsx',
    ],
  },
  plugins: [
    new webpack.IgnorePlugin(/^pg-native$/),
  ],
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'ts-loader?configFile=tsconfig.webpack.json',
          },
        ],
      },
    ],
  },
};
