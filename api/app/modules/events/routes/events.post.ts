import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import { Event } from '@typings/event';
import { paramCase } from 'change-case';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { eventsCreate, getEventBySlug, ngEvent } from '../controllers/event.info';
import { eventsGenerateShortId } from '../controllers/events.helpers';

export const eventsPost: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<Event> => {
  const role = request.rbac.getRole(request.user);
  // const role = (((request.user || {}).role || []).find(r => r.area === '') || config.rbac.defaultRole || { role: ''}).role;
  if (!await request.rbac.can(role, 'event:create')) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }
  const body: any = request.body || {},
        slugBody = body.slug || '',
        slug = slugBody ? paramCase(slugBody).toLowerCase() : paramCase(body.heading).toLowerCase();

  const existingSlug = await getEventBySlug(slug).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FINDING_EVENT_SLUG', _err);
  });

  if (existingSlug) {
    throw request.generateError(httpCodes.CONFLICT, 'SLUG_IN_USE');
  }

  body.shortId = eventsGenerateShortId().
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_GENERATING_EVENT_SHORTID', _err);
  });
  if (!body.shortId) {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_GENERATING_EVENT_SHORTID');
  }

  const eventInfo = await eventsCreate(body).
  catch((_err: Error) => {
    if (_err.message !== 'dupliate_event') {
      request.log.error('Creating Event Failed: %s', (_err.message || ''));
      throw request.generateError(httpCodes.CONFLICT, _err.name, _err);
    }
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, _err.message, _err);
  });
  reply.code(httpCodes.CREATED);
  return ngEvent(eventInfo);
};

/* eslint-disable @typescript-eslint/naming-convention */
export const eventsPostSchema = {
  response: {
    201: {
      type: 'object',
      properties: {
        active: { type: 'string' },
        short_id: { type: 'string' },
        registration_html: { type: 'string' },
      },
    },
  },
};
