#!/usr/bin/env node

const fs = require('fs');
const ora = require('ora');
const chalk = require('chalk');
const process = require('child_process');
const utils = require('./src/utils');
const pkg = require('./package.json');

/**
 * Choose version type
 */
async function selectVersion() {
  const versions = pkg.version.split('.').map((t) => parseInt(t));
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

(async () => {
  await selectVersion();
  await rewritePackage();
})();
