import httpCodes from '@inip/http-codes';
import { paramCase } from 'change-case';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getBlogBySlug, updatePost } from '../controllers/blog';

export const blogPut: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {

  if (!await request.rbac.can((request.user || {}).role || '', 'blog:create')) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }
  const params: any = request.params || {},
        id = params.id || '',
        body: any = request.body || {};

  if (body.hasOwnProperty('slug')) {
    const slugBody = body.slug || '',
          slug = slugBody ? paramCase(slugBody).toLowerCase() : paramCase(body.heading).toLowerCase();

    const existingSlug = await getBlogBySlug(slug).
    catch((_err: Error) => {
      throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FINDING_POST_SLUG', _err);
    });

    if (existingSlug && existingSlug.id !== id) {
      throw request.generateError(httpCodes.CONFLICT, 'SLUG_IN_USE');
    }
    body.slug = slug;
  }

  const post = await updatePost(body, id).
  catch((_err: Error) => {
    request.log.error('Updating Post Failed: %s', (_err.message || ''));
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_UPDATING_POST', _err);
  });

  reply.code(httpCodes.OK);
  return post;
};

export const blogPutSchema = {
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
    },
  },
  body: {
    type: 'object',
    properties: {
      backgroundImage: { type: 'string' },
      heading: { type: 'string' },
      subHeading: { type: 'string' },
      meta: { type: 'string' },
      body: { type: 'string' },
    },
    required: [],
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
