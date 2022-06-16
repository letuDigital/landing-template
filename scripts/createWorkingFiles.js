const { LANDING_NAME } = require('../config/appConfig');
const { mkdir, writeFile } = require('fs');
const { dirname, resolve } = require('path');
const log = require('./log');
const downloadFile = require('./downloadFile');
const checkFile = require('./checkFile');

const srcDir = resolve(__dirname, `../src/${LANDING_NAME}`);
const hbs = resolve(srcDir, 'content.hbs');
const css = resolve(srcDir, 'content.css');
const stubImg = resolve(srcDir, 'images/stub.png');

/**
 *
 * @param {string} path
 * @returns {Promise<void>}
 */
const createDir = async (path) => {
  await mkdir(dirname(path), { recursive: true }, async (err) => {
    if (err) {
      throw new Error(`Can't create directory ${path}`);
    }
  });
};

/**
 *
 * @param {string} path
 * @param {string} data
 */
const createFiles = (path, data) => {
  writeFile(path, data, (error) => {
    if (error) {
      throw error;
    }
    log(`Done: ${path}`);
  });
};

/**
 *
 * @returns {Promise<void>}
 */
const createWorkingFiles = async () => {
  await createDir(hbs);
  await createDir(stubImg);

  await downloadFile(
    'https://imgholder.ru/api/?width=420&height=236&background=854c91&color=f1ecfc&fontFamily=bebas&text=%D0%A2%D0%B5%D1%81%D1%82%D0%BE%D0%B2%D0%B0%D1%8F%20%D0%BA%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BA%D0%B0/n%D0%9D%D0%B5%20%D0%B7%D0%B0%D0%B1%D1%83%D0%B4%D1%8C%20%D1%83%D0%B4%D0%B0%D0%BB%D0%B8%D1%82%D1%8C!',
    stubImg,
  );

  const hasHbs = await checkFile(hbs);
  const hasCss = await checkFile(css);

  if (!hasHbs) {
    createFiles(
      hbs,
      `<div class="${LANDING_NAME}-block">
  <h2>Краткая инструкция по работе с контентом</h2>
  <ul>
    <li>Картинки можно (но не обязательно) класть в папку <b>src/[НАЗВАНИЕ ЛЕНДИНГА]/images</b></li>
    <li>
      HTML код пишем в файле <b>src/[НАЗВАНИЕ ЛЕНДИНГА]/content.hbs</b>.
      Handlebars используется для возможности перезагрузки страницы во время разработки.
      По сути это html файл, но для любителей hbs можно использовать и его возможности.
    </li>
    <li>
      CSS код пишем в файле <b>src/[НАЗВАНИЕ ЛЕНДИНГА]/content.css</b>.
      Если нужна возможность использовать препроцессоры - можно реализовать отдельно.
    </li>
    <li>
      Название лендинга задаётся переменной <b>LANDING_NAME</b>, в файле .env,
      более подробно о параметрах написано в README.md
    </li>
    <li>
      После финальной сборки обязательно выполнить предпросмотр собранного финального результата.
      Картинки перекладываются в другую папку и есть ненулевая вероятность некорректного отображения.
      Такое действие необходимо для удобства загрузки вёрстки на сайт.
    </li>
  </ul>
  <br>

  <h2>Пример картинки:</h2>
  <img src="./src/${LANDING_NAME}/images/stub.png" alt="${LANDING_NAME}">

  <h2>Доступные для использования цвета:</h2>
  <div class="${LANDING_NAME}-colors">
  {{#each colors}}
    <span><i style="background-color: {{this}}"></i>{{this}}</span>
  {{/each}}
  </div>
</div>
`,
    );
  }

  if (!hasCss) {
    createFiles(
      css,
      `.${LANDING_NAME}-block {
  padding: 20px;
  background: #f0f0f0;
}

.${LANDING_NAME}-colors span {
  display: inline-block;
  padding: 3px;
  width: 100px;
}

.${LANDING_NAME}-colors i {
  display: inline-block;
  margin-right: 5px;
}

.${LANDING_NAME}-colors i::after {
  display: block;
  width: 1em;
  height: 1em;
  content: "";
}`,
    );
  }
};

module.exports = createWorkingFiles;
