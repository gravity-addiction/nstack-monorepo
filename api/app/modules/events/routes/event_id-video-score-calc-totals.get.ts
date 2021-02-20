import httpCodes from '@inip/http-codes';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { calcScorecardTotal, insertEventScorecard } from '../controllers/event.scores';

export const eventIdVideoScoreCalcTotalsGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {
  const params: any = request.params || {},
        videoId = parseInt(params.video_id, 10) || 0;

  /*
  const userId = (request.user || {}).id || null;
  const userRole = (request.user || {}).role || '';
  if (!await request.rbac.can(userRole, 'event:video-score')) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }
  */
  const scoreTotals = await calcScorecardTotal(videoId).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'Error Calulating Video Total', _err);
  });

  await insertEventScorecard(videoId, 0, scoreTotals.totalScore, scoreTotals.pointsInTime, JSON.stringify(scoreTotals.scInfo));

  reply.code(httpCodes.CREATED);
  return scoreTotals;
};
