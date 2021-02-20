import httpCodes from '@inip/http-codes';
import { ResultsEvent } from '@typings/event';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getEventBySlug } from '../controllers/event.info';
import { getEventPage, getEventPageById } from '../controllers/event.pages';

export const eventIdPagesGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {

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

  let event: any = { content: '' };
  if (query.page) {
    event = await getEventPage(eventInfo.id, query.page).
    catch((_err: Error) => {
      request.log.error('Getting Event Page Failed: %s', (_err.message || ''));
      throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_GETTING_EVENT_PAGE', _err);
    });
  } else if (query.id) {
    event = await getEventPageById(eventInfo.id, query.id).
    catch((_err: Error) => {
      request.log.error('Getting Event Page by Id Failed: %s', (_err.message || ''));
      throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_GETTING_EVENT_PAGE_ID', _err);
    });
  }

  reply.code(httpCodes.OK);
  return event.content || '';
};
