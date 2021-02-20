import httpCodes from '@inip/http-codes';
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

  if (!await request.rbac.can((request.user || {}).role || '', 'user:edit', rbacParams)) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }

  const userInfo = await updateUserInfo(userId, body).
  catch((_err: Error) => {
    throw request.generateError(500, 'Update User Error, getUserById()', _err);
  });

  reply.code(httpCodes.OK);
  return userInfo;
};
