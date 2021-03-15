import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getUserById } from '../controllers/users.info';

export const userIdGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {

  const params: any = request.params || {},
        userId = params.user_id || 0,
        rbacParams = {
          user: request.user.id,
          id: userId,
        };

  const role = request.rbac.getRole(request.user);
  // const role = (((request.user || {}).role || []).find(r => r.area === '') || config.rbac.defaultRole || { role: ''}).role;
  if (!await request.rbac.can(role, 'user:view', rbacParams)) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }

  const userInfo = await getUserById(userId).
  catch((_err: Error) => {
    throw request.generateError(500, 'Get User Error, getUserById()', _err);
  });

  reply.code(httpCodes.OK);
  return userInfo;
};
