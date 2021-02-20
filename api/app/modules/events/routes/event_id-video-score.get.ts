import httpCodes from '@inip/http-codes';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';
import { RowDataPacket } from 'mysql2';

import { getEventScorecard, getScorecardsByVideoOfficial } from '../controllers/event.scores';

export const eventIdVideoScoreGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<RowDataPacket[]> => {
  const params: any = request.params || {},
        videoId = params.video_id || '',
        query: any = request.query || {},
        cardQuery = query.query || 'self',
        cardTeam = query.team || 0,
        cardRound = query.rnd || 0;

  let scCard: any[] = [];
  if (cardQuery === 'official') {

    scCard = await getScorecardsByVideoOfficial(videoId).
    then((scArr: RowDataPacket[]) => scArr.map(sc => JSON.parse(sc.scCard || ''))).
    catch((_err: Error) => {
      throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FIND_SCORECARDS', _err);
    });

  } else {
    const userId = (request.user || {}).id || null;
    const userRole = (request.user || {}).role || '';
    if (!await request.rbac.can(userRole, 'event:video-score:get')) {
      throw request.generateError(httpCodes.UNAUTHORIZED);
    }

    scCard = await getEventScorecard(videoId, userId).
    then((scArr: RowDataPacket[]) => scArr.map(sc => JSON.parse(sc.scInfo || '[]'))).
    catch((_err: Error) => {
      throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FIND_SCORECARDS', _err);
    });
  }

  reply.code(httpCodes.OK);
  return scCard;
};
