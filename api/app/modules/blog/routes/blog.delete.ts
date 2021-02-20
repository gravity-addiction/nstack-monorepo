import httpCodes from '@inip/http-codes';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { deletePost } from '../controllers/blog';

export const blogDelete: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {

  if (!await request.rbac.can((request.user || {}).role || '', 'blog:create')) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }
  const params: any = request.params || {},
        id = params.id || '';

  const post = await deletePost(id).
  catch((_err: Error) => {
    request.log.error('Deleting Post Failed: %s', (_err.message || ''));
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_DELETING_POST', _err);
  });

  reply.code(httpCodes.NO_CONTENT);
  return;
};

export const blogDeleteSchema = {
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
    },
  },
  response: {
    204: {
      description: 'Successfully deleted',
      type: 'null',
    },
  },
};
