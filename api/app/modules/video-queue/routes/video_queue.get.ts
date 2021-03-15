import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';
import { RowDataPacket } from 'mysql2';

import { getVideoQueueList } from '../controllers/video-queue';

export const videoQueueGet: RouteHandlerMethod = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<any> => {

  const userRole = request.rbac.getRole(request.user);
  if (!await request.rbac.can(userRole, 'video-queue:get')) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }

  const query: any = request.query || {},
        offset = query.offset || 0,
        limit = query.limit || 50;

  const videoQueueList = await getVideoQueueList(offset, limit).
  then((vqArr: RowDataPacket[]) => vqArr.map(vq => {
    try {
      vq.spliceArray = JSON.parse(vq.spliceArray);
    } catch (e) { }
    return vq;
  })).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FIND_VIDEOQUEUE', _err);
  });

  reply.code(httpCodes.OK);
  return videoQueueList;
};
