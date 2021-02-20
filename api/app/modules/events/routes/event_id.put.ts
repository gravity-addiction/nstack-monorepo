import httpCodes from '@inip/http-codes';
import { Event, ResultsEvent } from '@typings/event';
import { paramCase } from 'change-case';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { eventsUpdate, getEventBySlug, ngEvent } from '../controllers/event.info';

export const eventIdPut: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<Event> => {

  if (!await request.rbac.can((request.user || {}).role || '', 'event:edit')) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }

  const params: any = request.params || {},
        id = params.id || '',
        body: any = request.body || {};

  // Check updated slug
  if (body.hasOwnProperty('slug')) {
    const slugBody = body.slug || '',
          slug = slugBody ? paramCase(slugBody).toLowerCase() : paramCase(body.heading).toLowerCase();

    const existingSlug: ResultsEvent = await getEventBySlug(slug).
    catch((_err: Error) => {
      throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FINDING_EVENT_SLUG', _err);
    });

    if (existingSlug.id !== id) {
      throw request.generateError(httpCodes.CONFLICT, 'SLUG_IN_USE');
    }

    body.slug = slug;
  }

  const event = await eventsUpdate(body, id).
  catch((_err: Error) => {
    request.log.error('Updating Event Failed: %s', (_err.message || ''));

    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_UPDATING_EVENT', _err);
  });

  reply.code(httpCodes.OK);
  return ngEvent(event);
};
