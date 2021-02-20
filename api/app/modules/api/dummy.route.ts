import httpCodes from '@inip/http-codes';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

export const dummy: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> => {
  reply.code(httpCodes.NO_CONTENT);
  return;
};
