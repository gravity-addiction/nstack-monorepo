import httpCodes from '@inip/http-codes';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { addVideoQueueSplice } from '../controllers/video-queue';

export const videoQueueIdSplicePut: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> => {
  const params: any = request.params || {},
        body: any = request.body || {};

  const videoQueueId = parseInt(params.video_queue_id, 10) || 0;

  const userId = (request.user || {}).id || null;
  const userRole = (request.user || {}).role || '';
  if (!await request.rbac.can(userRole, 'video-queue:splice')) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }

  if (!videoQueueId) {
    return request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_NO_VIDEOQUEUEID');
  }

  await addVideoQueueSplice(videoQueueId, body.spliceEvent, body.spliceTime).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_ADDING_VIDEOQUEUE_SPLICE', _err);
  });

  reply.code(httpCodes.NO_CONTENT);
  return;
};
