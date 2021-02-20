import httpCodes from '@inip/http-codes';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getEventWithComps } from '../controllers/event.comps';
import { getEventTeamsByComp } from '../controllers/event.teams';

export const eventIdWithCompsGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {

  const params: any = request.params || {},
        eventId = params.event_id || '';

  const eventComps = await getEventWithComps(eventId).
  catch((_err: Error) => {
    throw request.generateError(500, 'Cannot Get Event Comps', _err);
  });
  const eventTeams = await getEventTeamsByComp(eventId).
  catch((_err: Error) => {
    throw request.generateError(500, 'Cannot Get Event Teams', _err);
  });

  const eComp: any = eventComps[0] || {};
  /* eslint-disable @typescript-eslint/naming-convention */
  const retComps: any = {
    id: eComp.id,
    active: eComp.active,
    user: eComp.user,
    short_id: eComp.short_id,
    slug: eComp.slug,
    sheet_id: eComp.sheet_id,
    heading: eComp.heading,
    sub_heading: eComp.sub_heading,
    comps: [],
  };
  const eLen = eventComps.length;
  for (let e = 0; e < eLen; e++) {
    const data = eventComps[e];

    retComps.comps.push({
      id: data.compId,
      eventId: data.eventId,
      name: data.name,
      roundCnt: data.roundCnt,
      exRoundCnt: data.exRoundCnt,
      exRoundPre: data.exRoundPre,
      draw: (JSON.parse((data.draw || '[]')) || []),
      complete: data.complete,
      status: data.status,
      notes: data.notes,
      teams: eventTeams.filter(t => t.compId === data.compId),
    });
  }

  reply.code(httpCodes.OK);
  return retComps;
};
