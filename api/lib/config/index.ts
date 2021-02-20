import { deepmerge } from '@lib/deep-merge';
import { existsSync, readFileSync } from 'fs';
import { basename, dirname, join as pathJoin } from 'path';
import { Script as vmScript } from 'vm';

import configDefault from './default';

export let config: any = configDefault;

export const loadConfig = (confDir: string, confFile: string) => {
  if (!confDir && confFile) { // No Folder, Has File,
    confDir = dirname(confFile) || '';
    confFile = basename(confFile);
  } else if (confDir && !confFile) { // Has Folder, No File,
    confFile = './index.js';
  } else if (!confFile && !confDir) { // No folder, No File - defaults to ./config in working directory
    confDir = process.cwd() || '';
    confFile = './config.js';
  }

  config = deepmerge(config, { confFileLoaded: [confFile] });
  const filepath = pathJoin(confDir, confFile);

  if (Array.isArray(config.loadedConfigFiles) && config.loadedConfigFiles.indexOf(filepath) !== -1) {
    console.log('Already Loaded Config File:', filepath);
  } else if (existsSync(filepath)) {
    console.log('Loading Config File:', filepath);
    config.loadedConfigFiles.push(filepath);
    const configJS = readFileSync(filepath, 'utf-8');
    const script = new vmScript(configJS);
    const vmContext = { config: {}, process };

    try {
      script.runInNewContext(vmContext);
    } catch (err) {
      console.log('Config File:', filepath, '\nError Loading Config:\n', err);
    }

    if (vmContext.hasOwnProperty('config')) {
      const uConf: any = vmContext.config;
      config = deepmerge(config, uConf);

      if (uConf.hasOwnProperty('configFileThread') && Array.isArray(uConf.configFileThread)) {
        for (const i of uConf.configFileThread) {
          loadConfig(confDir, i as string);
        }
      } else if (uConf.hasOwnProperty('configFileThread')) {
        loadConfig(confDir, uConf.configFileThread as string);
      }
    }
  } else {
    console.log('Cannot Find Config File:', filepath);
  }
};
