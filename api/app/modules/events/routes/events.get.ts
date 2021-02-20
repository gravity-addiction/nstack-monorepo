import httpCodes from '@inip/http-codes';
import { EventSimple, ResultsEvent } from '@typings/event';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getEvents, ngEventSimple } from '../controllers/event.info';

export const eventsGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<EventSimple[]> => {

  let eventList = await getEvents().
  catch((_err: Error) => {
    throw request.generateError(500, 'Cannot get Events, getEvents()', _err);
  });

  if (!request.user) {
    eventList = eventList.filter(e => e.active === 1);
  }

  reply.code(httpCodes.OK);
  return eventList.map((r: ResultsEvent) => ngEventSimple(r));
};

/* eslint-disable @typescript-eslint/naming-convention */
export const eventsGetSchema = {
  response: {
    200: {
      type: 'array',
      items: {
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
  },
};
