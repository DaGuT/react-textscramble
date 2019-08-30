const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const isProd = true;

module.exports = {
  mode: 'production',
  devtool: isProd
    ? false
    : 'source-map',
  entry: './src/TextScramble.js',
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'TextScramble.js',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isProd
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        },
        include: path.join(__dirname, 'src'),
        exclude: /(node_modules|bower_components|build)/
      }
    ]
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()]
  }
};