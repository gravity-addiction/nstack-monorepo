// https://www.fastify.io/docs/latest/Routes/
import { FastifyPluginCallback, FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from 'fastify';

import { videoQueueGet } from './routes/video_queue.get';
import { videoQueueIdSplicePut } from './routes/video_queue_id-splice.put';

export const videoQueue: FastifyPluginCallback = async (
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: HookHandlerDoneFunction
): Promise<void> => {

  fastify.get('/', { }, videoQueueGet);
  fastify.put('/:video_queue_id/splice', { }, videoQueueIdSplicePut);
  done();
};
