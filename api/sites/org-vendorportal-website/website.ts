// https://www.fastify.io/docs/latest/Routes/
import { config } from '@lib/config';
import { createConnection } from '@lib/db';

import { apiDecorators } from '@app/modules/api/index';
import { invoices } from '@app/modules/invoices/index';
import { squareup } from '@app/modules/squareup';
import { users } from '@app/modules/users/index';
import { auth, authSecure } from '@app/modules/users/auth';

import { bearer } from '@app/plugins/bearer';

import { FastifyApp } from '@app/index';

// Initializer Function for Fastify
const website = async () => {
  const fastifyApp = new FastifyApp();

  // Register Standard Shared API Resources
  fastifyApp.server.register(apiDecorators);

  // Start Database Connection
  createConnection(config.db);

  // Regsiter API Routes Specified in this file
  const apiPrefix = (config.hasOwnProperty('apiPrefix')) ? config.apiPrefix : '';

  // UNSECURED ROUTES
  // Authentication Routes
  fastifyApp.server.register(auth, { prefix: apiPrefix + '/' });
  // Invoices Routes
  fastifyApp.server.register(invoices, { prefix: apiPrefix + '/invoice' });
  // Squareup Routes
  fastifyApp.server.register(squareup, { prefix: apiPrefix + '/squareup' });

  // SECURE ROUTES WITH BEARER TOKEN
  // Check for jwt token and populate request.user
  fastifyApp.server.register(bearer); 

  // Auth Secured Routes
  fastifyApp.server.register(authSecure, { prefix: apiPrefix });
  // Users Secured Routes
  fastifyApp.server.register(users, { prefix: apiPrefix + '/users' });
  // All Setup, Start Listening for connections
  await fastifyApp.listen();
};

export default website;

website();
