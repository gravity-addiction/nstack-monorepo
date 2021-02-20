// https://www.fastify.io/docs/latest/Routes/
import { FastifyPluginCallback, FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from 'fastify';

import { spotifyGetCodePost, spotifyGetCodePostSchema } from '../spotify/routes/spotify-get-code.post';

import { rpiGetCodePost, rpiGetCodePostSchema } from './routes/rpi-get-code.post';


export const rpi: FastifyPluginCallback = async (
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: HookHandlerDoneFunction
): Promise<void> => {
  fastify.post('/spotify', { schema: spotifyGetCodePostSchema }, spotifyGetCodePost);
  fastify.post('/code', { schema: rpiGetCodePostSchema }, rpiGetCodePost);
  // fastify.post('/', { }, spotifyGet);
  // fastify.get('/:id', { }, spotifyPost);

  done();
};
