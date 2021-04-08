const fs = require('fs');
const ora = require('ora');
const path = require('path');
const handlebars = require('handlebars');
const download = require('download-git-repo');
const utils = require('./utils');

const config = {
  HTML_WEBPACK: {
    name: 'html-webpack',
    repo: 'Vincent0700/html-webpack-template',
    callback: renderHtmlWebpackTemplate,
    sources: ['package.json', 'package-lock.json', 'README.md', 'public/index.html']
  },
  HTML_WEBPACK_TS: {
    name: 'html-webpack-ts',
    repo: 'Vincent0700/html-webpack-ts-template',
    callback: renderHtmlWebpackTsTemplate,
    sources: ['package.json', 'package-lock.json', 'README.md', 'public/index.html']
  },
  WEBPACK5_VUE2_TS_LIB: {
    name: 'webpack5-vue2-ts-lib',
    repo: 'Vincent0700/webpack5-vue2-ts-lib-template',
    callback: renderWebpack5Vue2TsLibTemplate,
    sources: ['package.json', 'package-lock.json', 'README.md', 'public/index.html']
  }
};

/**
 * Input promot wrapper
 * @param {string} key
 * @param {string} defaultVal
 */
async function input(key, defaultVal = '') {
  return await utils.promot({
    type: 'input',
    message: `Input [${key}]`,
    default: defaultVal
  });
}

/**
 * Fetch template repository
 * @param {string} url
 * @param {string} dirname
 */
function fetchRepo(url, dirname) {
  return new Promise((resolve, reject) => {
    const spinner = ora('Downloading repository ...').start();
    download(url, dirname, (err) => {
      spinner.succeed();
      err ? reject(err) : resolve();
    });
  });
}

/**
 * Compile template
 * @param {string} filepath
 * @param {object} params
 */
function renderSync(filepath, params) {
  const repath = path.join(params.name, filepath);
  const content = fs.readFileSync(repath, { encoding: 'utf-8' });
  const compiled = handlebars.compile(content)(params);
  fs.writeFileSync(repath, compiled);
}

/**
 * Render Html-Webpack-Template
 * @link https://github.com/Vincent0700/html-webpack-template.git
 * @param {object} params
 */
function renderHtmlWebpackTemplate(params) {
  const spinner = ora('Initializing project ...').start();
  config.HTML_WEBPACK.sources.map((filepath) => renderSync(filepath, params));
  spinner.succeed();
}

/**
 * Render Html-Webpack-Typescript-Template
 * @link https://github.com/Vincent0700/html-webpack-ts-template.git
 * @param {object} params
 */
function renderHtmlWebpackTsTemplate(params) {
  const spinner = ora('Initializing project ...').start();
  config.HTML_WEBPACK_TS.sources.map((filepath) => renderSync(filepath, params));
  spinner.succeed();
}

/**
 * Render Webpack5-VUE2-Typescript-Library-Template
 * @link https://github.com/Vincent0700/webpack5-vue2-ts-lib-template.git
 * @param {object} params
 */
function renderWebpack5Vue2TsLibTemplate(params) {
  const spinner = ora('Initializing project ...').start();
  config.WEBPACK5_VUE2_TS_LIB.sources.map((filepath) => renderSync(filepath, params));
  spinner.succeed();
}

(async () => {
  // select template
  const template = await utils.promot({
    type: 'list',
    message: 'Choose template',
    choices: Object.values(config).map((item) => item.name),
    filter: (value) => Object.values(config).find((item) => item.name === value)
  });

  // input project name
  const projectName = await input('name', template.name);
  // input author
  const author = await input('author', 'Vincent0700 <wang.yuanqiu007@gmail.com>');
  // input email
  const email = await input('email', 'wang.yuanqiu007@gmail.com');
  // input description
  const description = await input('description', 'say something ...');

  // fetch template
  await fetchRepo(template.repo, projectName || template.name);

  // render template
  const params = { name: projectName, author, email, description };
  template.callback(params);
})();
