const getFiles = require('./getFiles');
const { extname, resolve } = require('path');
const { readFileSync } = require('fs');
const log = require('./log');

const getFilesByExtension = async (filePath, ext) => {
  const files = [];

  for await (const fileName of getFiles(filePath)) {
    files.push(fileName);
  }

  return files.filter((file) => {
    return extname(file) === ext;
  });
};

/**
 * Validate html file
 *
 * @param {string} file
 */
const validate = (file) => {
  const fileData = readFileSync(file, 'utf8');
  if (fileData.includes('<script')) {
    log(`Error in ${file}`);
    log(`You can't use JS in html content!`);
    process.exit(1);
  }
};

/**
 * Check HTML files
 */
getFilesByExtension(resolve(__dirname, '../src'), '.hbs').then((files) => {
  files.forEach(validate);
});

/**
 * Check Stub images
 */
// getFilesByExtension(resolve(__dirname, '../public/common/img/uploaded/products/'), '.png').then((files) => {
//   files.forEach((file) => {
//     if (file.includes('stub.png')) {
//       log(`Please remove stub image: ${file}`);
//       process.exit(1);
//     }
//   });
// });
