import httpCodes from '@inip/http-codes';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getBlogById, getBlogBySlug } from '../controllers/blog';

export const blogGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {
  const params: any = request.params || {},
        id = params.id || '',
        query: any = request.query || {},
        findBy = query.findBy || '';

  let post: any;

  if (findBy === 'slug') {
    post = await getBlogBySlug(id).
    catch((_err: Error) => {
      throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FINDING_POST_SLUG', _err);
    });
  } else {
    post = await getBlogById(id).
    catch((_err: Error) => {
      throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FINDING_POST_ID', _err);
    });
  }
  reply.code(httpCodes.OK);
  return post;
};

export const blogGetSchema = {
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
    },
  },
  response: {
    200: {
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
};
