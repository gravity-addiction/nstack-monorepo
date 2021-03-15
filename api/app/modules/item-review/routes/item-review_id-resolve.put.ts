import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import * as Fastify from 'fastify';

import { resolveIssue } from '../controllers/item-reviews';

export const itemReviewIdResolvePut: Fastify.RouteHandlerMethod = async (
    request: Fastify.FastifyRequest,
    reply: Fastify.FastifyReply
): Promise<any> => {
  const role = request.rbac.getRole(request.user);
  // const role = (((request.user || {}).role || []).find(r => r.area === '') || config.rbac.defaultRole || { role: ''}).role;
  if (!await request.rbac.can(role, 'item_review:resolve')) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }

  const body: any = request.body || {},
        resolved = body.resolved,
        params: any = request.params || {},
        reviewId = params.id || '';

  await resolveIssue(reviewId, resolved).
  catch((_err: Error) => { throw request.generateError(500, 'Error Resolving Issue, resolveIssue()', _err); });

  reply.code(201).send({});
};
