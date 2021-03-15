import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';
import { RowDataPacket } from 'mysql2';

import { getEventScorecard, getScorecardsByVideoOfficial } from '../controllers/event.scores';
import { getEventVideoByCompInfo } from '../controllers/event.video-search';

export const eventIdScoresGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<RowDataPacket[]> => {
  const query: any = request.query || {},
        cardQuery = query.query || 'self',
        cardTeam = query.team || 0,
        cardRound = query.rnd || 0;

  let scCard: any[] = [];
  const videoId = await getEventVideoByCompInfo('', cardTeam, cardRound).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FIND_SCORECARDS', _err);
  });

  console.log('Get Video:', videoId);
  if (cardQuery === 'official') {
    scCard = await getScorecardsByVideoOfficial(videoId).
    then((scArr: RowDataPacket[]) => scArr.map(sc => JSON.parse(sc.scInfo || ''))).
    catch((_err: Error) => {
      throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FIND_SCORECARDS', _err);
    });

  } else {
    const userId = (request.user || {}).id || null;
    const userRole = request.rbac.getRole(request.user);
    // const userRole = (((request.user || {}).role || []).find(r => r.area === '') || config.rbac.defaultRole || { role: ''}).role;
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
