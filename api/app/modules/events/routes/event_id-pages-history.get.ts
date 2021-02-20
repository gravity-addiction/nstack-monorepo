import httpCodes from '@inip/http-codes';
import { ResultsEvent } from '@typings/event';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getEventBySlug } from '../controllers/event.info';
import { getEventPageHistory } from '../controllers/event.pages';

export const eventIdPagesHistoryGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any[]> => {

  const params: any = request.params || {},
        eventId = params.event_id || '',
        query: any = request.query || {};

  if (!eventId) {
    throw request.generateError(httpCodes.BAD_REQUEST, 'ERROR_NO_EVENT');
  }

  const eventInfo: ResultsEvent = await getEventBySlug(eventId).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FINDING_EVENT_SLUG', _err);
  });

  const eventPages = await getEventPageHistory(eventInfo.id, query.page).
  catch((_err: Error) => {
    request.log.error('Getting Event Page Failed: %s', (_err.message || ''));
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_GETTING_EVENT', _err);
  });

  reply.code(httpCodes.OK);
  return eventPages || [];
};
