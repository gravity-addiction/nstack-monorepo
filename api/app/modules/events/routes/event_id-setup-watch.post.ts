import { createGoogleChannel } from '@app/modules/google/controllers/google-channels.v3';
import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import { generateRandomString } from '@lib/fisher-yates-shuffle';
import { GoogleRequests } from '@lib/google/google.requests';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getEventBySlug } from '../controllers/event.info';

export const eventIdSetupWatchPost: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {
  const params: any = request.params || {},
        eventId = params.event_id || '',
        body: any = request.body || {},
        gReq = new GoogleRequests(request.gTokens);

  // const role = request.rbac.getRole(request.user);
  // const role = (((request.user || {}).role || []).find(r => r.area === '') || config.rbac.defaultRole || { role: ''}).role;
  // if (!await request.rbac.can(role, 'event:create')) {
  //  throw request.generateError(httpCodes.UNAUTHORIZED);
  // }

  // console.log('Event ID', eventId);
  // console.log('Event Info', body);

  // Check is Active Event
  const eventInfo = await getEventBySlug(eventId).
  catch((_err: Error) => {
    throw request.generateError(500, 'Cannot Get Event Information', _err);
  });
  if (!eventInfo.sheet_id) {
    throw request.generateError(400, 'No Google sheet assigned');
  }
  const uuid = generateRandomString(8, '0123456789abcdef'.split('')) + '-' +
      generateRandomString(4, '0123456789abcdef'.split('')) + '-' +
      generateRandomString(4, '0123456789abcdef'.split('')) + '-' +
      generateRandomString(12, '0123456789abcdef'.split(''));

  const resp = gReq.tokens.tokenV3.then((token: string) => {
    const url = `/drive/v3/files/${eventInfo.sheet_id}/watch`;

    return gReq.postRequest(token, 'www.googleapis.com', url, {
      id: uuid,
      type: 'web_hook',
      address: 'https://dev.skydiveorbust.com/api/latest/events/' + encodeURIComponent(eventId) + '/changed',
      token: 'secrettokenyall',
    });
  });

  await createGoogleChannel(uuid, resp, eventInfo.sheet_id, eventInfo.id).
  catch((_err: Error) => {
    console.log('Cannot Create Channel Record', resp);
  });

  reply.code(httpCodes.OK);
  return resp;

};
