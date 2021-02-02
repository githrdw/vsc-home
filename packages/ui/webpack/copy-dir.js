// Wonky move script to push dist to core

const fs = require('fs').promises;
const { join } = require('path');

const moveDir = async function (src, dest) {
  const files = await fs.readdir(src);
  let filesLeft = files.length;
  for (let i = 0; i < files.length; i++) {
    fs.copyFile(join(src, files[i]), join(dest, files[i]))
      .then(() => {
        filesLeft--;
        !filesLeft && fs.rmdir(src, { recursive: true });
      })
      .catch(e => {
        throw e;
      });
  }
};

module.exports = { moveDir };
