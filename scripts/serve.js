const concurrently = require('concurrently');
const { resolve } = require('path');
const port = process.env.PORT || 4200;
const projectName = process.argv[2] || '';

process.chdir(resolve(__dirname, '../')); // path from this script to root folder

console.log('cwd', process.cwd());
console.log('Running', projectName);
concurrently([
  // { command: `node scripts/pug-watch.js "${projectName}"`, name: 'PUG_WATCH', prefixColor: 'bgGreen.bold' },
  {
    command: `npm run ng -- serve ${projectName} --host 0.0.0.0 --port ${port} --proxy-config projects/${projectName}/src/proxy.conf.js`,
    name: 'SERVE',
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
