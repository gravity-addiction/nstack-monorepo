import httpCodes from '@inip/http-codes';
import * as Fastify from 'fastify';

import { resolveIssue } from '../controllers/item-reviews';

export const itemReviewIdResolvePut: Fastify.RouteHandlerMethod = async (
    request: Fastify.FastifyRequest,
    reply: Fastify.FastifyReply
): Promise<any> => {
  if (!await request.rbac.can(request.user.role, 'item_review:resolve')) {
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
