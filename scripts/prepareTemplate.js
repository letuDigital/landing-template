const { resolve } = require('path');
const axios = require('axios');
const log = require('./log');
const downloadFile = require('./downloadFile');
const { writeFile } = require('fs');
const prepareHtmlTemplate = require('./prepareHtmlTemplate');
const checkVersion = require('./checkVersion');

const stylesRegex = /<link rel="stylesheet" href="(.*?)"/gm;

checkVersion();

log('---------------------------');
log('     Подготовка данных:');
log('---------------------------');

axios({
  url: `https://www.letu.ru/penhaligons2022`,
  headers: {
    'content-type': 'text/html; charset=UTF-8',
    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  },
})
  .then(({ data, status }) => {
    if (!data) {
      return;
    }

    let match;

    while ((match = stylesRegex.exec(data)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (match.index === stylesRegex.lastIndex) {
        stylesRegex.lastIndex++;
      }
      const cssFile = match[1];

      downloadFile(`https://www.letu.ru${cssFile}`, resolve(`../public${cssFile}`)).then(() => {
        log(`файл сохранён: /public${cssFile}`);
      });
    }

    const htmlData = prepareHtmlTemplate(data);

    writeFile(resolve(`../index.html`), htmlData, (error) => {
      if (error) {
        throw error;
      }
      log('---------------------------');
      log('      Шаблон сохранён');
      log('---------------------------');
    });
  })
  .catch((err) => {
    log(err.message);
  })
  .finally(() => {
    log('---------------------------');
    log('Подготовка данных завершена');
    log('---------------------------');
  });
