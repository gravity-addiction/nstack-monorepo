import httpCodes from '@inip/http-codes';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getAllUsers } from '../controllers/users.info';

export const usersGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {
  if (!await request.rbac.can((request.user || {}).role || '', 'user:list')) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }

  const userList = await getAllUsers().
  catch((_err: Error) => {
    throw request.generateError(500, 'Get All Users Error, getAllUsers()', _err);
  });

  reply.code(httpCodes.OK);
  return userList;
};
