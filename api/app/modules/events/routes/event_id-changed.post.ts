
import httpCodes from '@inip/http-codes';
import { GoogleRequests } from '@lib/google/google.requests';
import { getRegistrationListComplete } from '@app/modules/google/controllers/google-sheets.v4';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getEventBySlug } from '../controllers/event.info';
import { processEventsRegistration } from '../controllers/events.registration';

const _eventIdChangedPostLast: any = {};

export const eventIdChangedPost: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {
  // Let google connection go asap
  reply.code(httpCodes.NO_CONTENT).send();

  const params: any = request.params || {},
        eventId: string = params.event_id;

  if (!eventId || eventId === '' || eventId === 'undefined') {
    console.log('Google Sheet Changed Error, No Event Supplied');
    return;
  }

  // Update Datestamp to latest request
  if (_eventIdChangedPostLast.hasOwnProperty(eventId) && _eventIdChangedPostLast[eventId] !== '') {
    console.log('Already Running');
    _eventIdChangedPostLast[eventId] = new Date();
    return;
  }
  _eventIdChangedPostLast[eventId] = new Date();
  // Assign Running Timestamp to curDate
  let curDate = new Date(_eventIdChangedPostLast[eventId].toString());

  const eventInfo = await getEventBySlug(eventId).
  catch((_err: Error) => {
    console.log('Cannot Get Event Information', _err);
    return;
  });

  if (!eventInfo) {
    // console.log('No event info returned');
    _eventIdChangedPostLast[eventId] = '';
    return;
  }

  if (!eventInfo.sheet_id) {
    // console.log('No Google sheet assigned');
    _eventIdChangedPostLast[eventId] = '';
    return;
  }

  const gReq = new GoogleRequests(request.gTokens);
  while (_eventIdChangedPostLast[eventId] !== '') {
    // console.log('Fetch Registrations');

    const regList = await getRegistrationListComplete(gReq, eventInfo.sheet_id).
    catch((_err: Error) => {
      console.log('Cannot Get Event Registrations From Google', _err);
      return;
    });

    // console.log(regList);
    if (eventInfo.sheet_id !== regList.spreadsheetId) {
      console.log('Spreadsheet mismatch, Google Response', regList.spreadsheetId, 'vs db', eventInfo.sheet_id);
      _eventIdChangedPostLast[eventId] = '';
      return;
    }

    await processEventsRegistration(((regList.valueRanges || [])[0] || {}).values);
    if (_eventIdChangedPostLast[eventId].toString() === curDate.toString()) {
      _eventIdChangedPostLast[eventId] = '';
    } else {
      curDate = new Date(_eventIdChangedPostLast[eventId]);
    }
  }

  // Headers from google
  // 'x-goog-channel-id': '2d1a7e83-f01e-bf7b-cc4bbb95e5e2',
  // 'x-goog-channel-expiration': 'Sun, 04 Oct 2020 17:00:54 GMT',
  // 'x-goog-resource-state': 'update',
  // 'x-goog-changed': 'properties',
  // 'x-goog-message-number': '135885',
  // 'x-goog-resource-id': '4I-Ge2liGtIspZ70njSAd9-4JlM',
  // eslint-disable-next-line max-len
  // 'x-goog-resource-uri': 'https://www.googleapis.com/drive/v3/files/1L0tdYb7Kn8B-7Kw-_S76q5q8WO8XFXGCLAiY7bHE2Q4?acknowledgeAbuse=false&supportsAllDrives=false&supportsTeamDrives=false&alt=json',
  // 'x-goog-channel-token': 'secrettokenyall',

  // console.log('ev', _eventIdChangedPostLast.toString());
  // console.log('Headers', request.headers);
  // console.log('Watch Callback', params);
};
