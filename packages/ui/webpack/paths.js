const { resolve } = require('path');

module.exports = {
  root: resolve(__dirname, '../'),
  outputPath: resolve(__dirname, '../', 'dist'),
  entryPath: resolve(__dirname, '../', 'src/index.tsx'),
  templatePath: resolve(__dirname, '../', 'src/template.html'),
  alias: {
    '@atoms': resolve(__dirname, '../src/atoms'),
    '@components': resolve(__dirname, '../src/components'),
    '@state': resolve(__dirname, '../src/state'),
    '@hooks': resolve(__dirname, '../src/hooks'),
  },
};
