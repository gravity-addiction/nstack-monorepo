// https://www.fastify.io/docs/latest/Routes/
import { FastifyInstance, FastifyPluginCallback, FastifyPluginOptions, HookHandlerDoneFunction } from 'fastify';


export const government: FastifyPluginCallback = async (
    fastify: FastifyInstance,
    _opts: FastifyPluginOptions,
    done: HookHandlerDoneFunction
): Promise<void> => {

  done();
};
