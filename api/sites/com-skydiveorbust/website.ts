// https://www.fastify.io/docs/latest/Routes/
import { config } from '@lib/config';
import { createConnection } from '@lib/db';

import { apiDecorators } from '@app/modules/api/index';
import { aws } from '@app/modules/aws';
import { blog } from '@app/modules/blog';
import { events } from '@app/modules/events';
import { profiles } from '@app/modules/profiles';
import { records, recordsAdmin } from '@app/modules/records';
import { rpi } from '@app/modules/rpi';
import { spotify, spotifyCallbacks } from '@app/modules/spotify';
import { squareup } from '@app/modules/squareup';
import { users } from '@app/modules/users/index';
import { auth, authSecure } from '@app/modules/users/auth';
import { videoQueue } from '@app/modules/video-queue';

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


  // SECURE ROUTES WITH BEARER TOKEN
  // Check for jwt token and populate request.user
  fastifyApp.server.register(bearer); // Check for jwt token and populate request.user

  // AWS AuthSecure
  fastifyApp.server.register(authSecure, { prefix: apiPrefix });
  // AWS Routes
  fastifyApp.server.register(aws, { prefix: apiPrefix + '/aws' });
  // Blog Post Routes
  fastifyApp.server.register(blog, { prefix: apiPrefix + '/blog' });
  // Events Routes
  fastifyApp.server.register(events, { prefix: apiPrefix + '/events' });
  // Profile Routes
  fastifyApp.server.register(profiles, { prefix: apiPrefix + '/profile' });
  // Records Routes
  fastifyApp.server.register(recordsAdmin, { prefix: apiPrefix + '/records/admin' });
  fastifyApp.server.register(records, { prefix: apiPrefix + '/records' });

  // Spotify Routes
  fastifyApp.server.register(spotify, { prefix: apiPrefix + '/spotify' });
  // Squareup Routes
  fastifyApp.server.register(squareup, { prefix: apiPrefix + '/squareup' });
  // Users Routes
  fastifyApp.server.register(users, { prefix: apiPrefix + '/users' });
  // Video Queue Routes
  fastifyApp.server.register(videoQueue, { prefix: apiPrefix + '/video-queue' });

  // Rpi Routes
  fastifyApp.server.register(rpi, { prefix: apiPrefix + '/rpi' });
  // Spotify Routes
  fastifyApp.server.register(spotifyCallbacks);

  // All Setup, Start Listening for connections
  await fastifyApp.listen();
};

export default website;

website();
