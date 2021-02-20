const concurrently = require('concurrently');
const { join, resolve } = require('path');
const { existsSync } = require('fs');
const apiPath = resolve(__dirname, '../dist/api');
const servePath = resolve(__dirname, '../../../scripts/serve.js');

console.log('API', apiPath);
console.log('NG', servePath);

if (!existsSync(resolve(__dirname, '../node_modules'))) {

}

concurrently([
  { command: `node "${join(apiPath, "website.js")}" --confdir "${join(apiPath, "config")}"`,
    name: 'API WEBSITE',
    prefixColor: 'bgGreen.bold'
  },

  {
    command: `node "${servePath}" com-skydiveorbust`,
    name: 'NG',
    prefixColor: 'bgBlue.bold',
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
