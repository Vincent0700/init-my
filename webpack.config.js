const path = require('path');
const { BannerPlugin, DefinePlugin } = require('webpack');
const ChmodWebpackPlugin = require('chmod-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const pkg = require('./package.json');
const resolve = (dir) => path.join(__dirname, dir);

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: 'production',
  devtool: false,
  target: 'node',
  entry: { index: resolve('src/index.js') },
  output: {
    path: resolve('dist'),
    filename: 'index.js'
  },
  externals: {
    ora: 'commonjs2 ora',
    inquirer: 'commonjs2 inquirer',
    handlebars: 'commonjs2 handlebars',
    chalk: 'commonjs2 chalk',
    'download-git-repo': 'commonjs2 download-git-repo'
  },
  plugins: [
    new DefinePlugin({
      'process.env': JSON.stringify({ VERSION: pkg.version })
    }),
    new CleanWebpackPlugin(),
    new BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
    new ChmodWebpackPlugin([{ path: resolve('dist/index.js'), mode: 755 }])
    // new BundleAnalyzerPlugin()
  ]
};
