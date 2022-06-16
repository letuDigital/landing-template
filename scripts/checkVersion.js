const axios = require('axios');
const log = require('./log');
const parse = require('date-fns/parse');
const formatDistance = require('date-fns/formatDistance');
const ruLocale = require('date-fns/locale/ru');

const currentDate = new Date();
const timestamp = currentDate.getTime();

const checkVersion = () => {
  axios({
    url: `https://www.letu.ru/dist/version.json?v=${timestamp}`,
  })
    .then(({ data }) => {
      /**
       * @property {object} data
       * @property {string} data.buildDate
       */
      const buildDate = data.buildDate;

      const buildDateTime = parse(buildDate, 'dd.MM.yyyyy HH:mm', currentDate);

      const buildTimeAgo = formatDistance(buildDateTime, currentDate, { addSuffix: true, locale: ruLocale });

      if (buildDate) {
        log('---------------------------');
        log('    Информация о релизе:');
        log('---------------------------');
        log(`Последний релиз был ${buildTimeAgo}.`);
      } else {
        log('Информация о релизе недоступна, что-то пошло не так...');
      }
    })
    .catch((err) => {
      log('Информация о релизе недоступна, что-то пошло не так...');
      log(err.message);
    })
    .then(() => {
      log('---------------------------');
    });
};
module.exports = checkVersion;
