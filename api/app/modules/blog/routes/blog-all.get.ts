import httpCodes from '@inip/http-codes';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getBlogAll } from '../controllers/blog';

export const blogAllGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {
  const blog = await getBlogAll().
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'Get User Error, getUserById()', _err);
  });

  reply.code(httpCodes.OK).send(blog);
};

export const blogAllGetSchema = {
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          slug: { type: 'string' },
          backgroundImage: { type: 'string' },
          heading: { type: 'string' },
          subHeading: { type: 'string' },
          meta: { type: 'string' },
          body: { type: 'string' },
        },
      },
    },
  },
};
