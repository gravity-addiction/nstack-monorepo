const concurrently = require('concurrently');
const { exec } = require('child_process');
const { join, resolve } = require('path');
const { existsSync } = require('fs');
const apiPath = resolve(__dirname, '../dist/api');
const servePath = resolve(__dirname, '../../../scripts/serve.js');

process.chdir(resolve(__dirname, "../"));

console.log('API', apiPath);
console.log('NG', servePath);
console.log('CWD', process.cwd());

const delayedStartup = () => {
  concurrently([{
      command: `node "${join(apiPath, "website.js")}" --confdir "${join(apiPath, "config")}"`,
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
};

const initSetup = async() => {
  function newExec(cmd) {
    return new Promise((resolve, reject) => {
      console.log('Exec Command', cmd);
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.warn(error);
        }
        resolve(stdout ? stdout : stderr);
      });
    });
  }

  if (!existsSync(resolve(__dirname, '../node_modules'))) {
    console.log('Prepping Project folder with npm install');
    await newExec('npm install');
  }

  if (!existsSync(resolve(__dirname, '../dist/api/website.js'))) {
    console.log('Compiling API Service');
    const servePath = resolve(__dirname, '../../../scripts/api.js');
    await newExec(`node "${servePath}" ./api/sites/com-skydiveorbust/webpack-sdob.config.js`);
  }

  delayedStartup();
}

initSetup();