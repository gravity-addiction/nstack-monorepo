'use strict';
const path = require('path');
const sh = require('shelljs');
const renderPug = require('./render-pug');

process.chdir(resolve(__dirname, '../')); // path from this script to root folder

console.log('cwd', process.cwd());
const projectName = process.argv[2] || '';
const srcPath = path.resolve(path.dirname(__filename), '../src');
sh.find(srcPath).forEach(_processFile);
const srcProjectsPath = path.resolve(path.dirname(__filename), path.join('../projects', projectName));
sh.find(srcProjectsPath).forEach(_processFile);

function _processFile(filePath) {
  if (
    filePath.match(/\.pug$/) &&
    !filePath.match(/pug_include/)
  ) {
    renderPug(filePath);
  }
}