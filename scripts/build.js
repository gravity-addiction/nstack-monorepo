const concurrently = require('concurrently');
const { resolve } = require('path');
const projectName = process.argv[2] || '';

process.chdir(resolve(__dirname, '../')); // path from this script to root folder

console.log('cwd', process.cwd());
console.log('Running', projectName);
concurrently([
  {
    command: `npm run ng -- build "${projectName}" --prod --build-optimizer=true`,
    name: 'NG_BUILD',
    prefixColor: 'bgBlue.orange',
  }
], {
  prefix: 'name',
  killOthers: ['failure', 'success'],
}).then(success, failure);

function success() {
  console.log('Success');
}

function failure() {
  console.log('Failure');
}