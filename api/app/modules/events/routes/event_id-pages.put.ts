import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import { ResultsEvent } from '@typings/event';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getEventBySlug} from '../controllers/event.info';
import { eventPagesInsert } from '../controllers/event.pages';

export const eventIdPagesPut: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {
  const role = request.rbac.getRole(request.user);
  // const role = (((request.user || {}).role || []).find(r => r.area === '') || config.rbac.defaultRole || { role: ''}).role;
  if (!await request.rbac.can((request.user || {}).role || '', 'event:edit')) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }

  const params: any = request.params || {},
        eventId = params.event_id || '',
        body: any = request.body || {};

  if (!eventId) {
    throw request.generateError(httpCodes.BAD_REQUEST, 'ERROR_NO_EVENT');
  }

  if (!body.hasOwnProperty('page') || body.page === null) {
    throw request.generateError(httpCodes.BAD_REQUEST, 'ERROR_NO_PAGE');
  }
  if (!body.hasOwnProperty('content') || body.content === null) {
    throw request.generateError(httpCodes.BAD_REQUEST, 'ERROR_NO_EVENT');
  }
  const eventInfo: ResultsEvent = await getEventBySlug(eventId).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FINDING_EVENT_SLUG', _err);
  });

  const event = await eventPagesInsert(eventInfo.id, body.page, body.content).
  catch((_err: Error) => {
    request.log.error('Updating Event Page Failed: %s', (_err.message || ''));
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_UPDATING_EVENT', _err);
  });

  reply.code(httpCodes.NO_CONTENT);
  return ;
};
