import webpack from 'webpack';
import config from '../../config';
import ModernizrWebpackPlugin from 'modernizr-webpack-plugin';
import WebpackPwaManifest from 'webpack-pwa-manifest';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import path from 'path';
let CopyWebpackPlugin = require('copy-webpack-plugin');
const paths = config.get('utils_paths');
import marked from 'marked';
const markdownRenderer = new marked.Renderer();
import babelConfig from '../../.babelrc.js';
const TerserPlugin = require('terser-webpack-plugin');

const SRC_PATH = path.resolve(__dirname, '../../src/');

const aliasPaths = {
  src: SRC_PATH,
  images: path.resolve(
    __dirname,
    '../../node_modules/@kudoo/components/build/assets/images'
  ),
  '@kudoo/graphql': path.resolve(
    __dirname,
    '../../node_modules',
    '@kudoo/graphql/build'
  ),
  '@client/helpers': path.resolve(SRC_PATH, './helpers'),
  '@client/store': path.resolve(SRC_PATH, './store'),
  '@client/common_screens': path.resolve(SRC_PATH, './screens/common'),
  '@client/screens': path.resolve(SRC_PATH, './screens'),
  '@client/Widget': path.resolve(SRC_PATH, './widgets'),
  '@client/security': path.resolve(SRC_PATH, './security'),
};

const webpackConfig = {
  name: 'client',
  target: 'web',
  entry: {
    app: [paths.project(config.get('dir_src')) + '/index.tsx'],
  },
  output: {
    filename: '[name].[hash].js',
    chunkFilename: 'chunks/[name].[hash].js',
    path: paths.project(config.get('dir_dist')),
    publicPath: '/',
    pathinfo: false,
  },
  devtool: 'source-map',
  plugins: [
    new CopyWebpackPlugin([
      {
        from: paths.project(config.get('dir_src')) + '/css',
        to: paths.project(config.get('dir_dist')) + '/src/css',
      },
      {
        from: path.resolve(aliasPaths.images, './favicon.ico'),
        to: paths.project(config.get('dir_dist')) + '/images/favicon.ico',
      },
      {
        from: path.resolve(aliasPaths.images, './logo1200px.png'),
        to: paths.project(config.get('dir_dist')) + '/images/logo1200px.png',
      },
    ]),
    new ModernizrWebpackPlugin(),
    new ExtractTextPlugin({ filename: 'css/[name].[hash].css' }),
    new webpack.ProvidePlugin({
      fetch:
        'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch',
      Promise:
        'imports-loader?this=>global!exports-loader?global.Promise!es6-promise',
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new WebpackPwaManifest({
      name: 'Kudoo | Where big ideas grow',
      short_name: 'Kudoo',
      description:
        'Kudoo Cloud is an open source ERP system built to democratize enterprise business systems and bring them to everybody.',
      background_color: '#ffffff',
      theme_color: '#2bc88f',
      display: 'standalone',
      icons: [
        {
          src: path.resolve(aliasPaths.images, './logo.png'),
          sizes: [36, 48, 72, 96, 144, 192], // multiple sizes
        },
      ],
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
  ],
  resolve: {
    alias: {
      ...aliasPaths,
      react: path.resolve(__dirname, '../../node_modules', 'react'), // refer this : https://github.com/JedWatson/react-select/issues/2025#issuecomment-349920421
    },
    modules: ['node_modules'],
    extensions: ['.json', '.js', '.jsx', '.tsx', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.toml$/,
        use: { loader: '@lcdev/toml-loader' },
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /.*(node_modules|kudoo-shared-components|kudoo-graphql).*/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      {
        test: /\.(js|jsx)$/,
        exclude: /.*(node_modules|kudoo-shared-components|kudoo-graphql).*/,
        use: {
          loader: 'babel-loader',
          options: babelConfig,
        },
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!postcss-loader',
        }),
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!postcss-loader!sass-loader',
        }),
      },
      {
        test: /vendor\/.+\.(jsx|js)$/,
        use: 'imports-loader?jQuery=jquery,$=jquery,this=>window',
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        exclude: /.*node_modules\/(?!@kudoo\/components).*/,
        use: 'url-loader?limit=10000&minetype=application/font-woff',
      },
      {
        test: /\.(ttf|eot|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        exclude: /.*node_modules\/(?!@kudoo\/components).*/,
        loader: 'file-loader?prefix=images/&name=[path][name].[ext]',
      },
      {
        test: /\.(png|jpg|jpeg|svg)(\?.*)?$/,
        exclude: /.*node_modules\/(?!@kudoo\/components).*/,
        loader: 'url-loader?limit=1024&name=images/[name].[ext]',
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /.*node_modules\/(?!@kudoo\/graphql).*/, // ignore all node_modules but don't ignore @kudoo/graphql module
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'markdown-loader',
            options: {
              pedantic: true,
              renderer: markdownRenderer,
            },
          },
        ],
      },
    ],
  },
  externals: {
    cheerio: 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
    fs: 'empty',
  },
  devServer: {
    open: true,
    hot: true,
    host: '0.0.0.0',
    inline: true,
    port: 8080,
    clientLogLevel: 'none',
    historyApiFallback: {
      disableDotRule: true,
    },
    watchOptions: {
      aggregateTimeout: 1000, // The default,
      ignored: /node_modules/,
    },
    stats: {
      assets: false,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: false,
      version: false,
      warnings: true,
      errors: true,
      entrypoints: false,
    },
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        moment: {
          test: /moment/,
          name: 'moment',
          chunks: 'all',
          priority: 1,
        },
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: -10,
        },
      },
    },
    minimizer: [
      new TerserPlugin({
        parallel: false,
        cache: false,
        sourceMap: false,
      }),
    ],
  },
};
// const commonChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
//   name: 'vendor',
//   filename: '[name].[hash].js',
// });
// webpackConfig.plugins.push(commonChunkPlugin);
export default webpackConfig;
