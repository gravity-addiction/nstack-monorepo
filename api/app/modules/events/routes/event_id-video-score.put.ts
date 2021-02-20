import { FsScoringClass } from '@classes/sdob-scoring/fs-scoring.class';
import httpCodes from '@inip/http-codes';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { calcScorecardTotal, insertEventScorecard } from '../controllers/event.scores';
import { getEventVideoFromSDOBox } from '../controllers/event.video-search';


export const eventIdVideoScorePut: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> => {
  const params: any = request.params || {},
        eventSlug = params.event_id || '',
        body: any = request.body || {};
  let videoId = parseInt(params.video_id, 10) || 0;

  const userId = (request.user || {}).id || null;
  const userRole = (request.user || {}).role || '';
  if (!await request.rbac.can(userRole, 'event:video-score')) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }

  // Find VideoId
  if (!videoId) {
    const compId = parseInt(body.compId, 10) || 0,
          teamNumber = body.team || '',
          rnd = parseInt(body.rnd, 10) || 0;

    const videoSearch = await getEventVideoFromSDOBox(eventSlug, compId, teamNumber, rnd).
    catch((_err: Error) => {
      throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FINDING_VIDEO', _err);
    });
    videoId = parseInt(videoSearch.id, 10) || 0;
  }

  if (!videoId) {
    return request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_NO_VIDEOID');
  }

  const marks = body.marks || [];
  const pit = FsScoringClass.calculatePit(marks) || 0;
  const totalscore = FsScoringClass.calculateScore(marks) || 0;

  await insertEventScorecard(videoId, userId, totalscore, pit, JSON.stringify(body));

  // Let user go at this point
  reply.code(httpCodes.NO_CONTENT).send();

  // create a final scorecard
  const scoreTotals = await calcScorecardTotal(videoId).
  catch((_err: Error) => {
    console.log('Error Calulating Video Total', _err);
  });
  await insertEventScorecard(videoId, 0, scoreTotals.totalScore, scoreTotals.pointsInTime, JSON.stringify(scoreTotals.scInfo)).
  catch((_err: Error) => {
    console.log('Error Inserting Video Total', _err);
  });

  return;
};
