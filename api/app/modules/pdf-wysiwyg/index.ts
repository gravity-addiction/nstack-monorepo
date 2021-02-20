// https://www.fastify.io/docs/latest/Routes/
import { FastifyPluginCallback, FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from 'fastify';

import { dummy } from '../api/dummy.route';

export const events: FastifyPluginCallback = async (
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: HookHandlerDoneFunction
): Promise<void> => {

  fastify.get('/pdf-wysiwyg/forms/:form/versions(/:version)?', { }, dummy);
  fastify.get('/pdf-wysiwyg/forms(/:form)?', { }, dummy);
  fastify.get('/pdf-wysiwyg/data/:data/version/:version', { }, dummy);
  fastify.get('/pdf-wysiwyg/data/:data', { }, dummy);
  fastify.post('/pdf-wysiwyg/forms/:form/versions/:version/:action', { }, dummy);
  fastify.post('/pdf-wysiwyg/forms/:form/versions(/:version)?', { }, dummy);

  done();
};
