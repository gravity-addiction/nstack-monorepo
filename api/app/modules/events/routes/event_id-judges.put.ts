import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { setEventJudgeOfficial, setEventJudgePrinciple } from '../controllers/event.judges';

export const eventIdJudgesOfficialPut: RouteHandlerMethod = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  const params: any = request.params || {},
        body: any = request.body || {},
        judgeList = body.judges || [],
        eventSlug = params.event_id || '',
        query: any = request.query || {},

        eventId = query.eventid || 0,
        compId = query.compid || 0,
        videoId = query.videoid || 0;

  const userId = (request.user || {}).id || null;
  const userRole = request.rbac.getRole(request.user);
  // const userRole = (((request.user || {}).role || []).find(r => r.area === '') || config.rbac.defaultRole || { role: ''}).role;
  // if (!await request.rbac.can(userRole, 'event:video-score')) {
  //   throw request.generateError(httpCodes.UNAUTHORIZED);
  // }

  await setEventJudgeOfficial(judgeList, videoId, compId, eventId).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'Error Setting Official Judges', _err);
  });

  reply.code(httpCodes.NO_CONTENT).send();
  return;
};

export const eventIdJudgesPrinciplePut: RouteHandlerMethod = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  const params: any = request.params || {},
        body: any = request.body || {},
        judgeList = body.judges || [],
        eventSlug = params.event_id || '',
        query: any = request.query || {},

        eventId = query.eventid || 0,
        compId = query.compid || 0,
        videoId = query.videoid || 0;

  const userId = (request.user || {}).id || null;
  const userRole = request.rbac.getRole(request.user);
  // const userRole = (((request.user || {}).role || []).find(r => r.area === '') || config.rbac.defaultRole || { role: ''}).role;
  // if (!await request.rbac.can(userRole, 'event:video-score')) {
  //   throw request.generateError(httpCodes.UNAUTHORIZED);
  // }

  await setEventJudgePrinciple(judgeList, videoId, compId, eventId).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'Error Setting Official Judges', _err);
  });

  reply.code(httpCodes.NO_CONTENT).send();
  return;
};
