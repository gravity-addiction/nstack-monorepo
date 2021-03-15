import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { resetChangePassword } from '../controllers/users.password';

export const userIdResetpasswordGet: RouteHandlerMethod = async (
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
  if (!await request.rbac.can(role, 'user:resetpassword', rbacParams)) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }

  const newPassword: string = await resetChangePassword(userId).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'Reset User Password Failed', _err);
  });

  if (newPassword === '') {
    throw request.generateError(409, 'Reset User Password Failed');
  }
  reply.code(httpCodes.CREATED);
  return { password: newPassword };
};
