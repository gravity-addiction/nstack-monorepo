import httpCodes from '@inip/http-codes';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getEventBySlug } from '../controllers/event.info';
import { createEventTeam } from '../controllers/event.teams';

export const eventIdTeamsPost: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {

  const params: any = request.params || {},
        eventId = params.event_id || '',
        body: any = request.body || {};

  const eventInfo = await getEventBySlug(eventId).
  catch((_err: Error) => {
    throw request.generateError(500, 'Cannot Get Event Information', _err);
  });

  if (!await request.rbac.can((request.user || {}).role || '', 'event:create:team', { user: eventInfo.user, id: request.user.id})) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }

  if (!body.compId) {
    throw request.generateError(httpCodes.BAD_REQUEST, 'No Comp ID Supplied');
  }

  const teamInfo = await createEventTeam(body).
  catch((_err: Error) => {
    throw request.generateError(500, 'Cannot Save New Team', _err);
  });

  reply.code(httpCodes.CREATED);
  return teamInfo;
};
