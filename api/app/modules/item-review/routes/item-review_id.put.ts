import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import * as Fastify from 'fastify';

import { createOverride, getReview } from '../controllers/item-reviews';

export const itemReviewIdPut: Fastify.RouteHandlerMethod = async (
    request: Fastify.FastifyRequest,
    reply: Fastify.FastifyReply
): Promise<any> => {
  const role = request.rbac.getRole(request.user);
  // const role = (((request.user || {}).role || []).find(r => r.area === '') || config.rbac.defaultRole || { role: ''}).role;
  if (!await request.rbac.can(role, 'item_review:resolve')) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }

  const body: any = request.body || {},
        vendorId = body.vendor || '',
        note = body.note || '',
        commission = body.commission || '',
        commissionDump = body.commission_dump || '',
        params: any = request.params || {},
        reviewId = params.id || '';

    const updateData: any = {};
    if (vendorId) { updateData.vendor_id = vendorId; }
    if (note) { updateData.note = note; }
    if (commissionDump) { updateData.commission = null;
    } else if (commission) { updateData.commission = commission; }

    const itemReview = await getReview(reviewId).
    catch((_err: Error) => { throw request.generateError(500, 'Fetching Item Reviews Error, getReview()', _err); });

    updateData.item_id = itemReview.item_id;
    await createOverride(updateData).
    catch((_err: Error) => { throw request.generateError(500, 'Error Creating Override, createOverride()', _err); });

    reply.code(201).send(updateData);
};
