const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { exec } = require('child_process');

const commonPaths = require('./paths');

module.exports = {
  mode: 'production',
  output: {
    filename: `[name].js`,
    path: commonPaths.outputPath,
    chunkFilename: `[name].js`,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true
      })
    ],
    // Automatically split vendor and commons
    // https://twitter.com/wSokra/status/969633336732905474
    // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'initial',
        },
        async: {
          test: /[\\/]node_modules[\\/]/,
          name: 'async',
          chunks: 'async',
          minChunks: 4,
        },
      },
    },
    // Keep the runtime chunk seperated to enable long term caching
    // https://twitter.com/wSokra/status/969679223278505985
    runtimeChunk: false,
  },

  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              modules: {
                localIdentName: '[local]___[contenthash:base64:5]',
              },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `[name].css`,
      chunkFilename: `[name].css`,
    }),
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
          exec('npm run snap', { cwd: commonPaths.outputPath }, (err, stdout, stderr) => {
            if (stdout) process.stdout.write(stdout);
            if (stderr) process.stderr.write(stderr);
          })
        });
      }
    }
  ]
};
