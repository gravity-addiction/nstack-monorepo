const concurrently = require('concurrently');
const { resolve } = require('path');
const webpathPath = process.argv[2] || '';

const oldCwd = process.cwd();
process.chdir(resolve(__dirname, '../')); // path from this script to root folder

console.log('cwd', process.cwd());
console.log('webpack path', webpathPath);

concurrently([
  {
    command: `webpack --config "${webpathPath}"`,
    name: 'API_BUILD',
    prefixColor: 'bgGreen.bold',
  }
], {
  prefix: 'name',
  killOthers: ['failure', 'success'],
}).then(success, failure);

function success() {
  console.log('Success');
  process.chdir(oldCwd);
}

function failure() {
  console.log('Failure');
  process.chdir(oldCwd);
}