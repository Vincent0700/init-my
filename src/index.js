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
    callback: renderHtmlWebpackTemplate
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
 * Async Compile template
 * @param {string} filepath
 * @param {object} params
 */
function renderSync(filepath, params) {
  const repath = path.join(params.name, 'package.json');
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
  renderSync('package.json', params);
  renderSync('package-lock.json', params);
  renderSync('README.md', params);
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
  template.callback({
    name: projectName,
    author,
    email,
    description
  });
})();
