// eslint-disable-next-line max-len
import { cancelGoogleChannel, getGoogleChannelByEventId, googleChannelsStopFileWatch } from '@app/modules/google/controllers/google-channels.v3';
import httpCodes from '@inip/http-codes';
import { GoogleRequests } from '@lib/google/google.requests';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

export const eventIdStopWatchPost: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {
  const params: any = request.params || {},
        eventId = params.event_id || '',
        gReq = new GoogleRequests(request.gTokens);

  // if (!await request.rbac.can((request.user || {}).role || '', 'event:create')) {
  //  throw request.generateError(httpCodes.UNAUTHORIZED);
  // }

  // console.log('Event ID', eventId);
  // console.log('Event Info', body);

  // Check is Active Event

  const channelInfo = await getGoogleChannelByEventId(eventId).
  catch((_err: Error) => {
    throw request.generateError(500, 'Cannot Get Channel Information', _err);
  });
  if (!channelInfo.hasOwnProperty('id')) {
    throw request.generateError(400, 'No Google Channel assigned');
  }

  await googleChannelsStopFileWatch(gReq, channelInfo.querydata).
  catch((_err: Error) => {
    throw request.generateError(500, 'Cannot Stop Channel Watch', _err);
  });

  await cancelGoogleChannel(channelInfo.channel_uuid).
  catch((_err: Error) => {
    throw request.generateError(500, 'Cannot Update DB to cancel channel watching', _err);
  });

  reply.code(httpCodes.NO_CONTENT);
  return;

};
