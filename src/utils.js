const inquirer = require('inquirer');

/**
 * Check object type
 * @param {any} value
 */
function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * Check array type
 * @param {any} value
 */
function isArray(value) {
  return Object.prototype.toString.call(value) === '[object Array]';
}

/**
 * Inquirer promote wrapper
 * @param {any} options
 * @returns {Promise<any>}
 */
function promot(options) {
  const isObj = isObject(options);
  if (isObj) options.name = 'value';
  return new Promise((resolve, reject) => {
    inquirer
      .prompt(options)
      .then((answers) => resolve(isObj ? answers['value'] : answers))
      .catch((error) => reject(error));
  });
}

module.exports = {
  isObject,
  isArray,
  promot
};
