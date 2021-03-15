import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

export const recordsAdminCheckPost: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {
  const role = request.rbac.getRole(request.user);
  // const role = (((request.user || {}).role || []).find(r => r.area === '') || config.rbac.defaultRole || { role: ''}).role;
  if (!await request.rbac.can(role, 'records:update')) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }

  const body = request.body || {};

  /*const userInfo = await createUser(body).
  catch((_err: Error) => {
    if (_err.message !== 'dupliate_username') {
      request.log.error('Adding New User Failed: %s', (_err.message || ''));
      throw request.generateError(500, _err.name, _err);
    }
    throw request.generateError(409, _err.message, _err);
  });
*/
  reply.code(httpCodes.OK);
  return [];
};
