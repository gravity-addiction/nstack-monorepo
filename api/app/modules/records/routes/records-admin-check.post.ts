import httpCodes from '@inip/http-codes';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

export const recordsAdminCheckPost: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {
  if (!await request.rbac.can((request.user || {}).role || '', 'records:update')) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }

  const body = request.body || {};
console.log(body);
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
