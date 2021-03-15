import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getUserRoles } from '../controllers/users.roles';

export const userIdRolesGet: RouteHandlerMethod = async (
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

  const userRoles = await getUserRoles(userId).
  catch((_err: Error) => {
    throw request.generateError(500, 'Get User Roles Error, getUserRoles()', _err);
  });

  reply.code(httpCodes.OK);
  return userRoles;
};
