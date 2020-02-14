import webpack from 'webpack';
import path from 'path';
let Dotenv = require('dotenv-webpack');
import webpackConfig from './_base';
import config from '../../config';
import HtmlWebpackPlugin from 'html-webpack-plugin';
const paths = config.get('utils_paths');

webpackConfig.mode = 'development';
webpackConfig.devtool = 'source-map';
webpackConfig.plugins.push(
  new Dotenv({
    path: path.resolve(__dirname, '../../.env.development'),
    safe: path.resolve(__dirname, '../../.env.sample'),
    systemvars: true,
  }),
  new HtmlWebpackPlugin({
    template: paths.src('../index.html'),
    hash: false,
    filename: 'index.html',
    inject: 'body',
    env: 'development',
    minify: {
      collapseWhitespace: true,
    },
  })
);
webpackConfig.plugins.push(
  new webpack.EnvironmentPlugin({
    NODE_ENV: 'development',
  })
);
webpackConfig.plugins.push(new webpack.DefinePlugin(config.get('globals')));

export default webpackConfig;
