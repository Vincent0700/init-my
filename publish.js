#!/usr/bin/env node

const fs = require('fs');
const ora = require('ora');
const chalk = require('chalk');
const process = require('child_process');
const npmLatest = require('npm-latest');
const utils = require('./src/utils');
const pkg = require('./package.json');

/**
 * Choose version type
 */
async function selectVersion() {
  // fetch latest npm package version
  const spinner = ora('Fetch npm version').start();
  const info = await npmLatest.getLatest('init-my');
  spinner.succeed(`Fetch npm version ${chalk.yellowBright(info.version)}`);

  // choose version type
  const versions = info.version.split('.').map((t) => parseInt(t));
  const versionTypeChoices = ['major', 'minor', 'patch'];
  const versionType = await utils.promot({
    type: 'list',
    message: `Choose version type`,
    choices: versionTypeChoices,
    default: 'patch',
    filter: (value) => versionTypeChoices.indexOf(value)
  });
  versions[versionType]++;
  pkg.version = versions.join('.');
}

/**
 * Rewrite & lint package.json
 */
async function rewritePackage() {
  const text = `Update version to ${chalk.yellowBright(pkg.version)}`;
  const spinner = ora(text).start();
  fs.writeFileSync('./package.json', JSON.stringify(pkg));
  process.execSync('npx prettier --write ./package.json');
  spinner.succeed();
}

/**
 * Publish package
 */
async function publishPackage() {
  const spinner = ora('Publish package').start();
  process.execSync('npm publish');
  spinner.succeed();
}

(async () => {
  await selectVersion();
  await rewritePackage();
  await publishPackage();
})();
