import httpCodes from '@inip/http-codes';
// eslint-disable-next-line max-len
import { FastifyPluginCallback, FastifyPluginOptions, FastifyInstance, FastifyRequest, FastifyReply, HookHandlerDoneFunction, preHandlerHookHandler } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import { retrieveAuthToken, setAuthToken } from './http';
import { resignToken, validateToken } from './tokens';

export * from './http';
export * from './tokens';

export const bearerProcess = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<any> => {
  const token = retrieveAuthToken(request);
  console.log('B Process', token);
  /*
  if (!token) {
    throw request.generateError(
      httpCodes.UNAUTHORIZED,
      'NOT_AUTHORIZED'
    );
  }
  */
  if (token) {
    request.log.debug(token);
    const [updateToken, userInfo] = await validateToken(token).
    catch((err: any) => {
      throw request.generateError(
        httpCodes.UNAUTHORIZED,
        err || 'CANNOT_VALIDATE_TOKEN'
      );
    });
    if (userInfo) {
      if (updateToken) {
        setAuthToken(request, reply, resignToken(userInfo));
      }
      return userInfo;
    }
  }

  return {};
};

export const bearerHook: preHandlerHookHandler = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> => {

  const userInfo = await bearerProcess(request, reply);
  if (userInfo.hasOwnProperty('id') && userInfo.id) {
    request.user = userInfo;
  }
};

export const bearerPlugin: FastifyPluginCallback = async (
    fastify: FastifyInstance,
    _opts: FastifyPluginOptions,
    done: HookHandlerDoneFunction
): Promise<void> => {
  fastify.log.info('Bearer Registered!');
  fastify.decorate('user', null);
  fastify.addHook('preHandler', bearerHook);
  done();
};

export const bearer = fastifyPlugin(bearerPlugin);
