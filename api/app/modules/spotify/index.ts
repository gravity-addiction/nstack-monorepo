// https://www.fastify.io/docs/latest/Routes/
import { FastifyPluginCallback, FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from 'fastify';

// import { spotifyGetCodePost, spotifyGetCodePostSchema } from './routes/spotify.get-code';
import { spotifyValidateCodeGet } from './routes/spotify-validate-code.get';
// import { spotifyPost } from './routes/spotify.post';

export const spotify: FastifyPluginCallback = async (
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: HookHandlerDoneFunction
): Promise<void> => {

  // fastify.get('/code', { schema: spotifyGetCodePostSchema }, spotifyGetCodePost);
  done();
};

export const spotifyCallbacks: FastifyPluginCallback = async (
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: HookHandlerDoneFunction
): Promise<void> => {

  fastify.get('/H3xx92sk', { }, spotifyValidateCodeGet);
  done();
};
