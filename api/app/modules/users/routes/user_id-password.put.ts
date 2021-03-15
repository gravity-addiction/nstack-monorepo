import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { authenticateUser, updateUserPassword } from '../controllers/users.password';

export const userIdPasswordPut: RouteHandlerMethod = async (
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

  const username = body.username || '',
        password = body.password || '',
        oldpassword = body.oldpassword || '';

  if (password === '') {
    throw request.generateError(409, 'blank password');
  } else if (username === '') {
    throw request.generateError(409, 'blank username');
  } else if (oldpassword === '') {
    throw request.generateError(409, 'blank oldpassword');
  }

  const id = await authenticateUser(username, oldpassword).
  catch((_err: Error) => {
    request.log.error('Auth User Password Failed: %s', _err.message);
    throw request.generateError(500, _err.message, _err);
  });

  if (!id) {
    throw request.generateError(409);
  }

  await updateUserPassword(userId, password).
  catch((_err: Error) => {
    request.log.error('Update User Password Failed: %s', _err.message);
    throw request.generateError(500, _err.message, _err);
  });

  reply.code(httpCodes.NO_CONTENT);
  return;
};
