// https://www.fastify.io/docs/latest/Routes/
import * as Fastify from 'fastify';

import { itemReviewGet } from './routes/item-review.get';
import { itemReviewIdResolvePut } from './routes/item-review_id-resolve.put';
import { itemReviewIdPut } from './routes/item-review_id.put';

export const itemReview: Fastify.FastifyPluginCallback = async (
    fastify: Fastify.FastifyInstance,
    _opts: any,
    done: any
): Promise<void> => {

  fastify.get('/', { }, itemReviewGet);
  fastify.put('/:id/resolve', { }, itemReviewIdResolvePut);
  fastify.put('/:id', { }, itemReviewIdPut);

  done();
};
