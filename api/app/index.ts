import { loadConfig, config } from '@lib/config';

import { fastify, FastifyInstance } from 'fastify';
import fastifyCors from 'fastify-cors';
import helmet from 'fastify-helmet';
const minimist = require('minimist');

// FastifyApp intermediary class
export class FastifyApp {
  public server!: FastifyInstance;

  constructor() {
    const args: any = minimist(process.argv);
    config.confFile = args.conffile;
    config.confDir = args.confdir;

    console.log('Loading Config Directory:', config.confDir);
    loadConfig(config.confDir, config.confFile);

    this.server = fastify({
      logger: config.logger,
    });

    // Complete Version Modules
    this.server.log.debug('Config Settings');
    this.server.log.debug(config);

    // Load order -> https://www.fastify.io/docs/latest/Getting-Started/#loading-order-of-your-plugins
    // Fastify Plugins
    this.server.register(helmet);
    if (config.useCors) {
      this.server.register(fastifyCors);
    }

    // Callback when server is ready for connections
    this.server.ready(() => {
      this.server.log.info('Available Routes');
      this.server.log.info('\n' + this.server.printRoutes());
    });

  }

  async listen(): Promise < unknown > {
    try {
      return await this.server.listen(config.httpPort, config.httpIp);
    } catch (error) {
      this.server.log.error(error.message);
      process.exit(1);
    }
  }

}
