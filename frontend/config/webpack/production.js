import path from "path";
import webpack from "webpack";
import webpackConfig from "./_base";
let Dotenv = require("dotenv-webpack");
const HtmlCriticalPlugin = require("html-critical-webpack-plugin");
import config from "../../config";
import HtmlWebpackPlugin from "html-webpack-plugin";
const paths = config.get("utils_paths");

webpackConfig.devtool = "cheap-module-source-map";
webpackConfig.plugins.push(
  new Dotenv({
    path: path.resolve(__dirname, "../../.env"),
    safe: path.resolve(__dirname, '../../.env.sample'),
    systemvars: true
  }),
  new HtmlWebpackPlugin({
    template: paths.src("../index.html"),
    hash: false,
    filename: "index.html",
    inject: "body",
    env: "production",
    minify: {
      collapseWhitespace: true
    }
  })
);
webpackConfig.plugins.push(
  new webpack.EnvironmentPlugin({
    NODE_ENV: "production"
  })
);
webpackConfig.plugins.push(new webpack.DefinePlugin(config.get("globals")));

webpackConfig.plugins.push(
  new HtmlCriticalPlugin({
    base: path.join(path.resolve(__dirname), "../../build/"),
    src: "index.html",
    inline: true,
    minify: true,
    dest: "index.html"
  })
);

export default webpackConfig;
