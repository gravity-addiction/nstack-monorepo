// https://www.fastify.io/docs/latest/Routes/
import { config } from '@lib/config';
import { createConnection } from '@lib/db';

import { apiDecorators } from '@app/modules/api/index';
import { squareup } from '@app/modules/squareup/index';

import { FastifyApp } from '@app/index';

// Initializer Function for Fastify
const webhooks = async () => {
  const fastifyApp = new FastifyApp();

  // Register Standard Shared API Resources
  fastifyApp.server.register(apiDecorators);

  // Start Database Connection
  createConnection(config.db);

  // Regsiter API Routes Specified in this file
  const apiPrefix = (config.hasOwnProperty('apiPrefix')) ? config.apiPrefix : '';

  // UNSECURED ROUTES
  // Squareup Routes
  fastifyApp.server.register(squareup, { prefix: apiPrefix + '/squareup' });

  // All Setup, Start Listening for connections
  await fastifyApp.listen();
};

export default webhooks;

webhooks();
