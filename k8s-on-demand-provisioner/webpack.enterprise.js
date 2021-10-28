'use strict';

const { merge } = require('webpack-merge');
const baseConfig = require('../webpack-base-enterprise');

const config = {
  entry: ['./src/server.ts'],
};

module.exports = merge(baseConfig, config);
