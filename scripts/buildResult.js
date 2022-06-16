const { readFileSync, createWriteStream } = require('fs');
const { resolve, basename } = require('path');
const JSZip = require('jszip');
const log = require('./log');
const getFiles = require('./getFiles');
const { LANDING_NAME } = require('../config/appConfig');

const zip = new JSZip();

const htmlRegexp = /<!--content-->[\s\S]*<!--\/content-->/;

let match;

const getImageFiles = async (filePath) => {
  const files = [];

  for await (const fileName of getFiles(filePath)) {
    files.push(fileName);
  }

  return files;
};

const packFiles = async () => {
  const cssFile = resolve(__dirname, `../build/${LANDING_NAME}/content.css`);
  const htmlFile = resolve(__dirname, `../build/${LANDING_NAME}/index.html`);

  const assetsFolder = resolve(__dirname, `../build/${LANDING_NAME}/common/img/uploaded/products/${LANDING_NAME}`);
  const htmlFileData = readFileSync(htmlFile, 'utf8');
  const cssFileData = readFileSync(cssFile, 'utf8');

  if ((match = htmlRegexp.exec(htmlFileData)) !== null) {
    zip.file(`content.html`, match[0]);
  }

  zip.file(`content.css`, cssFileData);

  const images = await getImageFiles(assetsFolder);

  images.forEach((file) => {
    const filePath = `common/img/uploaded/products/${LANDING_NAME}/${basename(file)}`;
    const fileData = readFileSync(file, 'binary');
    zip.file(filePath, fileData, { binary: true });
  });

  const outputFileName = resolve(__dirname, `../output/${LANDING_NAME}.zip`);

  zip
    .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    .pipe(createWriteStream(outputFileName))
    .on('finish', function () {
      log('========================');
      log('     Архив создан');
      log('========================');
      log(outputFileName);
    });
};

packFiles().then(() => {
  log('Всё готово для отправки заказчику!');
});
