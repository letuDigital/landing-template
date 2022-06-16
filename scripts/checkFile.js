const { promises: fs, constants } = require('fs');

/**
 *
 * @param {string} path
 * @returns {Promise<boolean>}
 */
const checkFile = async (path) => {
  try {
    await fs.access(path, constants.R_OK);
    return true;
  } catch {
    return false;
  }
};

module.exports = checkFile;
