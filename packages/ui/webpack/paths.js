const { resolve } = require('path');

module.exports = {
  root: resolve(__dirname, '../'),
  outputPath: resolve(__dirname, '../', 'dist'),
  entryPath: resolve(__dirname, '../', 'src/index.tsx'),
  templatePath: resolve(__dirname, '../', 'src/template.html')
};
