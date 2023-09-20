/**
 * Webpack main configuration file
 */

const path = require('path');
const OptimizeCssAssetsPlugin = require('image-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

assetsFolder = 'assets';
buildFolder = 'public/build';

module.exports = {
  entry: {
      main: [
      './'+assetsFolder+'/scss/urlslab_related_resources.scss',
      './'+assetsFolder+'/scss/urlslab_youtube_loader.scss',
      './'+assetsFolder+'/scss/urlslab_faq.scss',
      './'+assetsFolder+'/scss/urlslab_notifications.scss',
      ],
      'urlslab-lazyload':'./'+assetsFolder+'/js/urlslab-lazyload.js',
      'urlslab-notifications':'./'+assetsFolder+'/js/urlslab-notifications.js',
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, buildFolder),
    publicPath: '/'
  },
  context: __dirname,
  module: {
    rules: [
      {
        test: /\.((c|sa|sc)ss)$/i,
        use: [{loader:'file-loader', options: {name: 'css/[name].css'}},'extract-loader','css-loader','postcss-loader', 'sass-loader'],
      },
      {
        test: /\.worker\.js$/,
        use: { loader: "worker-loader" },
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: { name: 'images/[name].[ext]', publicPath: '../', limit: 8192 },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(ttf|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',
            options: { name: 'fonts/[name].[ext]', publicPath: '../', limit: 8192 },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      '...',
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              // Svgo configuration here https://github.com/svg/svgo#configuration
              [
                'svgo',
                {
                  plugins: [
                    {
                      name: 'removeViewBox',
                      active: false,
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      // dry: true,
      verbose: true,
      protectWebpackAssets: false,
    }),
    new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, assetsFolder, 'images'),
            to: path.resolve(__dirname, buildFolder, 'images/[name].[ext]'),
            toType: 'template',
            globOptions: {
              dot: true,
              ignore: '**/svg-icons/*.svg',
            },
          },
          // {
          //   from: path.resolve(__dirname, assetsFolder, 'fonts'),
          //   to: path.resolve(__dirname, buildFolder, 'fonts/[path][name].[ext]'),
          //   toType: 'template',
          // },
        ],
      }),
  ],
};
