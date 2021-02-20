const {
  ProgressPlugin,
  container: { ModuleFederationPlugin },
} = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const commonPaths = require('./paths');

module.exports = {
  entry: commonPaths.entryPath,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.(woff2|ttf|woff|eot)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      ...commonPaths.alias,
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'app1',
      // adds react as shared module
      // version is inferred from package.json
      // there is no version check for the required version
      // so it will always use the higher version found
      // shared: {
      //   react: {
      //     eager: false,
      //     import: 'react', // the "react" package will be used a provided and fallback module
      //     shareKey: 'react', // under this name the shared module will be placed in the share scope
      //     shareScope: 'default', // share scope with this name will be used
      //     singleton: true, // only a single version of the shared module is allowed
      //     version: '17.0.1',
      //   },
      //   'react-dom': {
      //     eager: false,
      //     singleton: true, // only a single version of the shared module is allowed
      //     version: '17.0.1',
      //   },
      // },
    }),
    new ProgressPlugin(),
    new HtmlWebpackPlugin({
      template: commonPaths.templatePath,
    }),
    new ESLintPlugin({
      extensions: ['.ts', '.tsx', '.js'],
      fix: true,
      emitWarning: process.env.NODE_ENV !== 'production',
    }),
  ],
  performance: {
    hints: false,
  },
};
