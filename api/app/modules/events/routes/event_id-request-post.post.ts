import { createSignedPostUrl } from '@app/modules/aws/controllers/aws.cmd-urls';
import { getAWSPostCreds } from '@app/modules/aws/controllers/aws.cmd-keys';
import { saveVideoUploadData } from '@app/modules/aws/controllers/aws.file-info';
import * as AwsKeys from '@app/modules/aws/controllers/aws.keys';
import { getRegistrationQuery } from '@app/modules/google/controllers/google-sheets.v4';
import httpCodes from '@inip/http-codes';
import { dateTimeMath } from '@lib/date-math';
import { generateRandomString } from '@lib/fisher-yates-shuffle';
import { GoogleRequests } from '@lib/google';
import { Registration } from '@typings/event';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';
import { join as pathJoin } from 'path';

import { getEventBySlug } from '../controllers/event.info';

export const eventIdRequestPostPost: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {

  const params: any = request.params || {},
        eventId = params.event_id || 'undefined',
        body: any = request.body || {},
        filename = body.filename || '',
        content = body.content || 'video/*',
        shortId = body.short_id || 'public-' + generateRandomString(5),
        discipline = body.discipline || '',
        rnd = body.rnd || '',
        gReq = new GoogleRequests(request.gTokens);

  let prefix = body.prefix || '';

  if (!filename || filename === '') {
    // console.log(new Date().toString(), shortId, 'No filename');
    throw request.generateError(404, 'No Filename Supplied');
  }

  if (!eventId || eventId === '' || eventId === 'undefined') {
    // console.log(new Date().toString(), shortId, 'No Event Supplied.', eventId);
    throw request.generateError(404, 'No Event Supplied');
  }

  const eventInfo = await getEventBySlug(eventId).
  catch((_err: Error) => {
    throw request.generateError(500, 'Cannot Get Event Information', _err);
  });
  if (!eventInfo.sheet_id) {
    throw request.generateError(400, 'No Google sheet assigned');
  }

  const sheetDataResp: Registration[] = await getRegistrationQuery(gReq, eventInfo.sheet_id, shortId).
  catch((_err: Error) => {
    throw request.generateError(500, 'Cannot Get Registrations', _err);
  });
  const sheetData = sheetDataResp[0] || {};

  /*
  if (sheetData.event !== eventId) {
    console.log(new Date().toString(), shortId, 'Event Mismatch.', sheetData.event, eventId);
    throw request.generateError(404, 'URL event does not match Sheet event');
  }
  */

  // console.log('User', (request.user || {}).id);
  const userCreds = await getAWSPostCreds((request.user || {}).id).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FINDING_USER', _err);
  });

  // console.log('Creds', userCreds);
  const homeDir = pathJoin('home/crw/comps/', '/' + eventId + '/', '/' + discipline + '/');
  if (prefix.indexOf(homeDir) === 0) {
    prefix = prefix.substr(homeDir.length);
  } else {
    prefix = '';
  }

  const s3FileExt = (filename.split('.') || []).pop() || '';
  const s3Filename = shortId + '-' + discipline + '-' + rnd + '-' + dateTimeMath(new Date()).toString() + '.' + s3FileExt;

  // Add Database Entry
  /* eslint-disable @typescript-eslint/naming-convention */
  await saveVideoUploadData(homeDir + prefix, s3Filename, {
    filename,
    event_id: eventId,
    discipline,
    rnd,
    short_id: shortId,
    sheet_id: eventInfo.sheet_id,
  });


  const postUrl = createSignedPostUrl(
    AwsKeys.S3(userCreds),
    'sdob-user-upload',
    homeDir + prefix + s3Filename,
    content,
    1200
  ).catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_CREATING_URL', _err);
  });

  reply.code(httpCodes.OK);
  return postUrl;
};
