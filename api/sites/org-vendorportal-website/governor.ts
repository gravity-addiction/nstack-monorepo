// https://www.fastify.io/docs/latest/Routes/
import { config } from '@lib/config';
import { createConnection } from '@lib/db';

import { apiDecorators } from '@app/modules/api/index';
import { government } from '@app/modules/government/index';
import { bearer } from '@app/plugins/bearer';

import { FastifyApp } from '@app/index';

// Initializer Function for Fastify
const governor = async () => {
  const fastifyApp = new FastifyApp();

  // Register Standard Shared API Resources
  fastifyApp.server.register(apiDecorators);

  // Start Database Connection
  createConnection(config.db);

  // Regsiter API Routes Specified in this file
  const apiPrefix = (config.hasOwnProperty('apiPrefix')) ? config.apiPrefix : '';

  // UNSECURED ROUTES


  fastifyApp.server.register(bearer); // Check for jwt token and populate request.user
  // SECURE ROUTES WITH BEARER TOKEN
  fastifyApp.server.register(government, { prefix: apiPrefix });

  // All Setup, Start Listening for connections
  await fastifyApp.listen();
};

export default governor;

governor();
