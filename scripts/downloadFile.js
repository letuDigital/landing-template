const axios = require('axios');
const { createWriteStream, mkdir } = require('fs');
const { dirname } = require('path');

/**
 *
 * @param {string} fileUrl File URL
 * @param {string} outputLocationPath File destination
 * @returns {Promise<void>}
 */
const downloadFile = async (fileUrl, outputLocationPath) => {
  await mkdir(dirname(outputLocationPath), { recursive: true }, async (err) => {
    if (err) {
      throw new Error("Can't create directory");
    }
    const writer = createWriteStream(outputLocationPath);

    return axios({
      method: 'get',
      url: fileUrl,
      responseType: 'stream',
    }).then(({ data }) => {
      return new Promise((resolve, reject) => {
        data.pipe(writer);
        let error = null;
        writer.on('error', (err) => {
          error = err;
          writer.close();
          reject(err);
        });
        writer.on('close', () => {
          if (!error) {
            resolve(true);
          }
          // no need to call the reject here, as it will have been called in the
          // 'error' stream;
        });
      });
    });
  });
};

module.exports = downloadFile;
