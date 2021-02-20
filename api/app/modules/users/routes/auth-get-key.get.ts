import httpCodes from '@inip/http-codes';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { authenticateAuthKeyGenerate } from '../controllers/users.password';

export const authenticationGetKeyGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<string> => {
  reply.code(httpCodes.OK);
  return authenticateAuthKeyGenerate();
};
