import httpCodes from '@inip/http-codes';
import { bearerProcess, deleteToken } from '@app/plugins/bearer';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

export const authenticateDelete: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {

  const userInfo = await bearerProcess(request, reply).catch((_err: Error) => { });

  if (userInfo.hasOwnProperty('id') && userInfo.id) {
    await deleteToken(userInfo.jti).catch((_err: Error) => { });
    return reply.code(httpCodes.NO_CONTENT);
  }

  reply.send(request.generateError(498));
};
