const { IS_FULL_WIDTH, LANDING_NAME } = require('../config/appConfig');
const distRegex = /\/dist/gm;
const manifestRegex = /dist\/manifest/gm;
const imagesRegex = /dist\/assets/gm;
const vTestRegex = /<div class="v-test">[\s\S]*?<div class="tab-bar-panel">/gm;
const metaRegex = /<meta data-vue-meta.*?>/gm;
const titleRegex = /<title>.*?</gm;

const contentRegex = /<div id="content-wrap">([\s\S]*?)<div class="footer-section">/gm;
const contentVariables = `
<%- cssCode %>
<%- htmlCode %>
`;
const wrappedlContent = `
<div class="row">
  <div class="col-xs-12">
    ${contentVariables}
  </div>
</div>
`;
const contentData = IS_FULL_WIDTH ? wrappedlContent : contentVariables;
const contentReplacer = `
  <div id="content-wrap">
    <div class="landing-content container">
      ${contentData}
    </div>
  </div>
</div>
<div class="footer-section">
`;

const prepareHtmlTemplate = (data) => {
  const htmlData = data
    .replace('<base href="/">', '')
    .replace('<base href="/">', '')
    .replace('/favicon.ico', 'https://www.letu.ru/favicon.ico')
    .replace(manifestRegex, 'https://www.letu.ru/dist/manifest')
    .replace(distRegex, 'dist')
    .replace(metaRegex, '')
    .replace(titleRegex, `<title>${LANDING_NAME}<`)
    .replace(contentRegex, contentReplacer)
    .replace(imagesRegex, 'https://www.letu.ru/dist/assets')
    .replace(vTestRegex, '<div class="tab-bar-panel">')
    .replace('</head>', '<script type="module" src="./index.js"></script></head>');
  return htmlData;
};
module.exports = prepareHtmlTemplate;
