// eslint-disable-next-line max-len
import { DoneFuncWithErrOrRes, FastifyPluginCallback, FastifyPluginOptions, FastifyInstance, FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

export const noCachePlugin: FastifyPluginCallback = async (
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: HookHandlerDoneFunction
): Promise<void> => {
	fastify.addHook('onSend', (_request: FastifyRequest, reply: FastifyReply, _payload: any, next: DoneFuncWithErrOrRes) => {
		reply.header('Surrogate-Control', 'no-store');
		reply.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
		reply.header('Pragma', 'no-cache');
		reply.header('Expires', '0');

		next();
	});
  done();
};

export const noCache = fastifyPlugin(noCachePlugin);
