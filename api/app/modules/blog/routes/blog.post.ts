import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import { paramCase } from 'change-case';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { createPost, getBlogBySlug } from '../controllers/blog';

export const blogPost: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {
  const role = request.rbac.getRole(request.user);
  // const role = (((request.user || {}).role || []).find(r => r.area === '') || config.rbac.defaultRole || { role: ''}).role;
  if (!await request.rbac.can(role, 'blog:create')) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }
  const body: any = request.body || {},
        slugBody = body.slug || '',
        slug = slugBody ? paramCase(slugBody).toLowerCase() : paramCase(body.heading).toLowerCase();

  const existingSlug = await getBlogBySlug(slug).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FINDING_POST_SLUG', _err);
  });

  if (existingSlug) {
    throw request.generateError(httpCodes.CONFLICT, 'SLUG_IN_USE');
  }

  body.slug = slug;
  const post = await createPost(body).
  catch((_err: Error) => {
    request.log.error('Adding New Post Failed: %s', (_err.message || ''));
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_CREATING_POST', _err);
  });

  reply.code(httpCodes.CREATED);
  return post;
};

export const blogPostSchema = {
  response: {
    201: {
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
