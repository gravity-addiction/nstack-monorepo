
import { getRegistrationList } from '@app/modules/google/controllers/google-sheets.v4';
import httpCodes from '@inip/http-codes';
import { GoogleRequests } from '@lib/google';
import { Registration } from '@typings/event';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getEventByShortId,  } from '../controllers/event.info';
import { ngRegistration } from '../controllers/events.registration';

export const eventIdRegistrationsGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<Registration[]> => {

  const params: any = request.params || {},
        eventId = params.event_id || '',
        gReq = new GoogleRequests(request.gTokens);

  const eventInfo = await getEventByShortId(eventId).
  catch((_err: Error) => {
    throw request.generateError(500, 'Cannot Get Event', _err);
  });
  if (!eventInfo.sheet_id) {
    throw request.generateError(400, 'No Google sheet assigned');
  }

  const reqQuery = await getRegistrationList(gReq, eventInfo.sheet_id, eventId).
  catch((_err: Error) => {
    throw request.generateError(500, 'Cannot Registrations', _err);
  });

  reply.code(httpCodes.OK);
  return reqQuery.map((q: any) => ngRegistration(q));
};

/* eslint-disable @typescript-eslint/naming-convention */
export const eventIdRegistrationsGetSchema = {
  params: {
    type: 'object',
    properties: {
      event_id: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          event: { type: 'string' },
          short_id: { type: 'string' },
          paid: { type: 'number' },
          team_name: { type: 'string' },
          amount: { type: 'number' },
        },
      },
    },
  },
};
