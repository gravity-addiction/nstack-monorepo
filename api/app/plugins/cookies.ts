import { FastifyPluginCallback, FastifyPluginOptions, FastifyInstance, HookHandlerDoneFunction } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import 'fastify-cookie';

export const cookiesPlugin: FastifyPluginCallback = async (
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: HookHandlerDoneFunction
): Promise<void> => {
  fastify.register(require('fastify-cookie'), {
    parseOptions: {},     // options for parsing cookies
  });
  done();
};

export const cookies = fastifyPlugin(cookiesPlugin);
