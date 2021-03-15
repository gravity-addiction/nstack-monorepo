import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { deleteUser } from '../controllers/users.info';

export const userIdDelete: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {
  const role = request.rbac.getRole(request.user);
  // const role = (((request.user || {}).role || []).find(r => r.area === '') || config.rbac.defaultRole || { role: ''}).role;
  if (!await request.rbac.can(role, 'user:delete')) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }

  const params: any = request.params || {},
        userId = params.user_id || 0;

  await deleteUser(userId).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'Get User Error, getUserById()', _err);
  });

  reply.code(httpCodes.NO_CONTENT);
  return;
};
