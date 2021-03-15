import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { updateUserInfo } from '../controllers/users.info';

export const userIdPut: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {
  const body: any = request.body || {},
        params: any = request.params || {},
        userId = params.user_id || 0,
        rbacParams = {
          user: request.user.id,
          id: userId,
        };

  const role = request.rbac.getRole(request.user);
  // const role = (((request.user || {}).role || []).find(r => r.area === '') || config.rbac.defaultRole || { role: ''}).role;
  if (!await request.rbac.can(role, 'user:edit', rbacParams)) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }

  const userInfo = await updateUserInfo(userId, body).
  catch((_err: Error) => {
    throw request.generateError(500, 'Update User Error, getUserById()', _err);
  });

  reply.code(httpCodes.OK);
  return userInfo;
};
