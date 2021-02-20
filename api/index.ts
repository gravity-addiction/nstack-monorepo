import { loadConfig } from '@lib/config';
import minimist from 'minimist';

import { FastifyApp } from './app/index';

const main = async () => {
  const args: any = minimist(process.argv);
  const confFile = args.conffile;
  const confDir = args.confdir;

  loadConfig(confDir, confFile);

  const fastifyApp = new FastifyApp();
  await fastifyApp.listen();
};

export default main;

main();
