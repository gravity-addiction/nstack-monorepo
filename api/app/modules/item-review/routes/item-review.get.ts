import httpCodes from '@inip/http-codes';
import * as Fastify from 'fastify';
import { RowDataPacket } from 'mysql2';

import { getReviews } from '../controllers/item-reviews';
import { itemRemap, paymentsFixup } from '../../squareup/controllers/squareup.transactions';

export const itemReviewGet: Fastify.RouteHandlerMethod = async (
    request: Fastify.FastifyRequest,
    reply: Fastify.FastifyReply
): Promise<any> => {
  if (!await request.rbac.can(request.user.role, 'item_review')) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }

  const query: any = request.query || {},
        dStart = query.start || 0,
        dTill = query.till || 0,
        resolved = parseInt(query.resolved, 10) || 0;

  const reviews: RowDataPacket[] = await getReviews(resolved, dStart, dTill).
  catch((_err: Error) => { throw request.generateError(500, 'Get Item Reviews Error, getReviews()', _err); });

  try {
    console.log(reviews);
    reviews.map((r: any) => r.json = paymentsFixup(itemRemap(r)));
  } catch (_err) {
    throw request.generateError(500, 'Get Item Reviews Error, Review Map', _err);
  }
  reply.code(200).send(reviews);
 };
