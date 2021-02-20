import { getRegistrationQuery } from '@app/modules/google/controllers/google-sheets.v4';
import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import { GoogleRequests } from '@lib/google';
import { Registration, RegistrationSet } from '@typings/event';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getEventSheetBySlug } from '../controllers/event.info';

export const eventIdRegistrationGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<RegistrationSet> => {

  const params: any = request.params || {},
        eventId = params.event_id || '',
        shortIdRaw = params.short_id || '',
        shortId = ((!config.shortidCasesensitive) ? shortIdRaw.toUpperCase() : shortIdRaw),
        gReq = new GoogleRequests(request.gTokens);

  const eventSheet = await getEventSheetBySlug(eventId).
  catch((_err: Error) => {
    throw request.generateError(500, 'Cannot Get Event', _err);
  });
  if (!eventSheet) {
    throw request.generateError(400, 'No Google sheet assigned');
  }

  const reqQuery: Registration[] = await getRegistrationQuery(gReq, eventSheet, shortId).
  catch((_err: Error) => {
    throw request.generateError(500, 'Cannot Get Registrations', _err);
  });

  // console.log('ReqQuery', reqQuery);
  if (!reqQuery || !reqQuery.length) {
    throw request.generateError(404, 'No Registration Found');
  }

  /* eslint-disable @typescript-eslint/naming-convention */
  const ret: RegistrationSet = {
    short_id: shortId,
    event: eventId,
    entries: reqQuery, // .map((rQ) => ngRegistration(rQ)),
  };

  reply.code(httpCodes.OK);
  return ret;
};

/* eslint-disable @typescript-eslint/naming-convention */
export const eventIdRegistrationGetSchema = {
  params: {
    type: 'object',
    properties: {
      event_id: { type: 'string' },
      short_id: { type: 'string' },
    },
  },
  response: {
    200: {
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
};
