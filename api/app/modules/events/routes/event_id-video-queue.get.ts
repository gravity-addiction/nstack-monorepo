import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import { IEventVideoQueue, ResultsEvent, ResultsEventVideoQueue } from '@typings/event';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getEventBySlug } from '../controllers/event.info';
import { eventVideoQueueParseRet, getEventVideoQueueForUser } from '../controllers/event.videos';

export const eventIdVideoQueueGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<IEventVideoQueue[]> => {
  const params: any = request.params || {},
        eventId = params.event_id || '';

  // Check is Active Event
  const eventInfo: ResultsEvent = await getEventBySlug(eventId).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FINDING_EVENT_SLUG', _err);
  });

  const userRole = request.rbac.getRole(request.user);
  // const userRole = (((request.user || {}).role || []).find(r => r.area === '') || config.rbac.defaultRole || { role: ''}).role;
  if (!await request.rbac.can(userRole, 'event:video-queue')) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }

  // console.log('Event ID', eventId);
  // console.log('Event Info', body);

  const ret: IEventVideoQueue[] = [];
  /*
  ret[0] = {
    name: '',
    queue: [],
    watched: [],
  };
  */

  await getEventVideoQueueForUser(request.user.id, 0, eventInfo.id).
  then((data: ResultsEventVideoQueue[]) => {
    eventVideoQueueParseRet(ret, data, 0, eventInfo.slug);
  }).
  catch((_err: Error) => {
    throw request.generateError(500, 'Cannot get Events Queue, eventIdVideoQueueGet()', _err);
  });

  await getEventVideoQueueForUser(request.user.id, 1, eventInfo.id).
  then((data: ResultsEventVideoQueue[]) => {
    eventVideoQueueParseRet(ret, data, 1, eventInfo.slug);
  }).
  catch((_err: Error) => {
    throw request.generateError(500, 'Cannot get Events Queue, eventIdVideoQueueGet()', _err);
  });
  reply.code(httpCodes.OK);
  // Wrap in array until we get more events and expand this project
  return ret;
};

export const eventIdVideoQueueNoscoreGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<IEventVideoQueue[]> => {
  const params: any = request.params || {},
        eventId = params.event_id || '',
        query: any = request.query || {},
        qStart = query.start || 0,
        qLimit = query.limit || 50;

  // Check is Active Event
  const eventInfo: ResultsEvent = await getEventBySlug(eventId).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FINDING_EVENT_SLUG', _err);
  });

  // console.log('Event ID', eventId);
  // console.log('Event Info', body);

  const ret: IEventVideoQueue[] = [];
  /*
  ret[0] = {
    name: '',
    queue: [],
    watched: [],
  };
  */

  await getEventVideoQueueForUser(0, 0, eventInfo.id, qStart, qLimit).
  then((data: ResultsEventVideoQueue[]) => {
    eventVideoQueueParseRet(ret, data, 0, eventInfo.slug);
  }).catch((_err: Error) => {
    throw request.generateError(500, 'Cannot get Events Queue, eventIdVideoQueueGet()', _err);
  });

  reply.code(httpCodes.OK);
  // Wrap in array until we get more events and expand this project
  return ret;
};
