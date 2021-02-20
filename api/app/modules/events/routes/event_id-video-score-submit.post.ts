import { FsScoringClass } from '@classes/sdob-scoring/fs-scoring.class';
import httpCodes from '@inip/http-codes';
// import { ResultsEvent } from '@typings/index';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { insertEventSubmission } from '../controllers/event.scores';


export const eventIdVideoScoreSubmitPost: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> => {
  const params: any = request.params || {},
        eventSlug = params.event_id || '',
        body: any = request.body || {};

  // const userId = (request.user || {}).id || null;
  // const userRole = (request.user || {}).role || '';
  // if (!await request.rbac.can(userRole, 'event:video-score')) {
  //   throw request.generateError(httpCodes.UNAUTHORIZED);
  // }

  await insertEventSubmission(eventSlug, body).
  catch((_err: Error) => {
    console.log('Error Inserting Video Total', _err);
  });

  const marks = body.marks || [];

  // Let user go at this point
  reply.code(httpCodes.NO_CONTENT).send();
  return;
};
