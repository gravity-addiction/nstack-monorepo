import httpCodes from '@inip/http-codes';
import { Event, EventSimple } from '@typings/event';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getEventBySlug, ngEvent, ngEventSimple } from '../controllers/event.info';

export const eventIdGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<Event | EventSimple> => {

  const params: any = request.params || {},
        eventId = params.event_id || '';

  const regInfo = await getEventBySlug(eventId).
  catch((_err: Error) => {
    throw request.generateError(500, 'Get User Error, getUserById()', _err);
  });

  const userRole = (request.user || {}).role || '';
  if (userRole && await request.rbac.can(userRole, 'event:create')) {
    reply.code(httpCodes.OK);
    return ngEvent(regInfo);
  }

  reply.code(httpCodes.OK);
  return ngEventSimple(regInfo);
};

/* eslint-disable @typescript-eslint/naming-convention */
export const eventIdGetSchema = {
  params: {
    type: 'object',
    properties: {
      event_id: {
        type: 'string',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        active: { type: 'number' },
        user: { type: 'number' },
        short_id: { type: 'string' },
        slug: { type: 'string' },
        sheet_id: { type: 'string' },
        heading: { type: 'string' },
        sub_heading: { type: 'string' },
        meta: { type: 'string' },
        backgroundImage: { type: 'string' },
        registration_html: { type: 'string' },
        registered_html: { type: 'string' },
        registered_paid_html: { type: 'string' },
        registered_unpaid_html: { type: 'string' },
      },
    },
  },
};
