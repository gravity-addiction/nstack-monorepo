const concurrently = require('concurrently');
const { join, resolve } = require('path');

const apiPath = resolve(__dirname, '../dist/api');
const servePath = resolve(__dirname, '../../../scripts/serve.js');

console.log('API', apiPath);
console.log('NG', servePath);

concurrently([
  { command: `node "${join(apiPath, "website.js")}" --confdir "${join(apiPath, "website")}"`,
    name: 'API WEBSITE',
    prefixColor: 'bgGreen.bold'
  },
  { command: `node "${join(apiPath, "webhooks.js")}" --confdir "${join(apiPath, "webhooks")}"`,
    name: 'API WEBHOOKS',
    prefixColor: 'bgGreen.bold'
  },
  { command: `node "${join(apiPath, "governor.js")}" --confdir "${join(apiPath, "governor")}"`,
    name: 'API GOVERNOR',
    prefixColor: 'bgGreen.bold'
  },

  {
    command: `node "${servePath}" org-vendorportal-website`,
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
