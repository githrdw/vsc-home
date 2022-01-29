const {
  ProgressPlugin,
  container: { ModuleFederationPlugin },
} = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');
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
        type: 'asset/resource',
        generator: {
          filename: 'ui-[id][ext]',
        },
      },
      {
        test: /\.(woff2|ttf|woff|eot)$/,
        type: 'asset/resource',
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
      shared: {
        react: {
          eager: true,
          singleton: true, // only a single version of the shared module is allowed
          version: '17.0.1',
          requiredVersion: '17.0.1',
        },
        'react-dom': {
          eager: true,
          singleton: true, // only a single version of the shared module is allowed
          version: '17.0.1',
          requiredVersion: '17.0.1',
        },
      },
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
    new CspHtmlWebpackPlugin(
      {
        'script-src': `'nonce-CSP_NONCE' 'strict-dynamic'`,
        'style-src': `CSP_SOURCE 'nonce-CSP_NONCE'`,
      },
      {
        nonceEnabled: {
          'script-src': false,
          'style-src': false,
        },
        hashEnabled: {
          'style-src': false,
        },
      }
    ),
  ],
  performance: {
    hints: false,
  },
};
