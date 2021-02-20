import httpCodes from '@inip/http-codes';
import { getRegistrationCounts } from '@app/modules/google/controllers/google-sheets.v4';
import { GoogleRequests } from '@lib/google/google.requests';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getEventByShortId } from '../controllers/event.info';

export const eventIdCountsGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {

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

  const regCounts = await getRegistrationCounts(gReq, eventInfo.sheet_id).
  catch((_err: Error) => {
    throw request.generateError(500, 'Cannot get registration counts', _err);
  });

  reply.code(httpCodes.OK);
  return regCounts;
};
