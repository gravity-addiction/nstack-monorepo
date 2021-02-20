// https://www.fastify.io/docs/latest/Routes/
import { FastifyPluginCallback, FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from 'fastify';

import { profileSearchGet, profileSearchGetSchema } from './routes/profile-search.get';
import { profileGet, profileGetSchema } from './routes/profile.get';

export const profiles: FastifyPluginCallback = async (
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: HookHandlerDoneFunction
): Promise<void> => {

  fastify.get('/search', { schema: profileSearchGetSchema }, profileSearchGet);
  fastify.get('/:profile', { schema: profileGetSchema }, profileGet);
  done();
};
