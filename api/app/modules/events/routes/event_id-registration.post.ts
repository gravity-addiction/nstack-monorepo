import { addRowWithHeaders, getRegistrationQuery } from '@app/modules/google/controllers/google-sheets.v4';
import httpCodes from '@inip/http-codes';
import { generateRandomString } from '@lib/fisher-yates-shuffle';
import { GoogleRequests } from '@lib/google/google.requests';
import { Registration } from '@typings/event';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getEventBySlug } from '../controllers/event.info';

export const eventIdRegistrationPost: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {
  const params: any = request.params || {},
        eventId = params.event_id || '',
        body: any = request.body || {},
        gReq = new GoogleRequests(request.gTokens);

  // if (!await request.rbac.can((request.user || {}).role || '', 'event:create')) {
  //  throw request.generateError(httpCodes.UNAUTHORIZED);
  // }

  // console.log('Event ID', eventId);
  // console.log('Event Info', body);

  // Check is Active Event
  const eventInfo = await getEventBySlug(eventId).
  catch((_err: Error) => { throw request.generateError(500, 'Cannot Get Event Information', _err); });
  if (!eventInfo.sheet_id) {
    throw request.generateError(400, 'No Google sheet assigned');
  }

  // Save Event Info To Spreadsheet
  const sheetRows = [];
  const perPerson = body.perPerson || {},
        entries = perPerson.entries || [],
        eLen = entries.length;

  if (!Array.isArray(entries) || eLen === 0) {
    throw request.generateError(httpCodes.BAD_REQUEST, 'Entires invalid, requires Array');
  }

  // Generate Registration ShortID
  const shortId = generateRandomString(3, '346789ABCDEFGHJKLMNPQRSTVWXYZ'.split(''));
  let hasUniqueShort = false;
  let uniqueAttempts = 0;

  // CHECK Short ID Unique
  while (!hasUniqueShort && uniqueAttempts < 10) {
    const reqQuery: Registration[] = await getRegistrationQuery(gReq, eventInfo.sheet_id, shortId).
    catch((_err: Error) => { throw request.generateError(500, 'Cannot Get Registrations', _err); });
    if (reqQuery && !reqQuery.length) {
      hasUniqueShort = true;
    }
    uniqueAttempts += 1;
  }

  if (!hasUniqueShort) {
    throw request.generateError(500, 'Cannot Find an Unused ID');
  }

  for (let e = 0; e < eLen; e++) {
    /* eslint-disable @typescript-eslint/naming-convention */
    sheetRows.push({
      short_id: shortId,
      onsite: body.onsite,
      dropzone: body.dropzone,
      name: entries[e].name,
      email: entries[e].email,
    });
  }

  await addRowWithHeaders(gReq, eventInfo.sheet_id, 'participants', sheetRows).
  catch((_err: Error) => {
    throw request.generateError(500, 'Cannot Save Registration', _err);
  });

  reply.code(httpCodes.OK);
  return sheetRows;

/*
const source = fetchSource('registration') || false;
  if (!source) { return Promise.resolve(['bad_db_source']); }

  const params = req.params || {},
        event_id = params.event_id || '',
        body = req.body || {};

  body.event = event_id;

/*
  const captcaForm = {
    secret: google_captcha_secret,
    response: body.recaptcha,
    remoteip: ''
  };

  try {
    captcaForm.remoteip = req.connection.remoteAddress;
  } catch (e) { }


  // Check Captcha
  new Promise((resolve, reject) => {
    post('https://www.google.com/recaptcha/api/siteverify',
      { form: captcaForm },
      (error, response) => {
        if (!error && response.statusCode === 200) {
          resolve();
        } else {
          reject({message: `Failed Captcha Verification. Code: ${response.statusCode}, ${error}`});
        }
      }
    );
  }).
  // Generate SHORT ID
  then(data => {
    delete body.recaptcha;
*/

/* eslint-disable max-len */
/*
  // new Promise((resolve, reject) => {
    shortid.characters(shortid_chars);
    const searchWords = shortid_removewords;
    const searchExp = new RegExp(searchWords.split(',').join('|'), 'gi');
    body.short_id = shortid.generate();
    if (!shortid_casesensitive) { body.short_id = body.short_id.toUpperCase(); }
    while (searchExp.test(body.short_id)) { body.short_id = shortid.generate(); }

    let amt = 0;
    if (body.cf_4way_rotation) { amt += 5; }
    if (body.cf_2way_sequential) { amt += 5; }
    if (amt > 0) {
      body.amount = amt;
      body.simple_amount = Math.round(amt * 100);
    }
  //   body.paid = '=IF(SUMPRODUCT(EXACT(INDIRECT("payments!"&SUBSTITUTE(ADDRESS(1,MATCH("short_id",payments!A1:ZZ1,0),4), 1, "")&":"&SUBSTITUTE(ADDRESS(1,MATCH("short_id",payments!A1:ZZ1,0),4), 1, "")), INDIRECT(SUBSTITUTE(ADDRESS(1,MATCH("short_id",participants!A1:ZZ1,0),4), 1, "")&row()))), "Yes", "No")';
    body.paid = `=IF(
      SUMIF(
        INDIRECT("payments!" & SUBSTITUTE(ADDRESS(1,MATCH("short_id",payments!$A$1:$ZZ$1,0),4), 1, "") & ":" & SUBSTITUTE(ADDRESS(1,MATCH("short_id",payments!$A$1:$ZZ$1,0),4), 1, "")),
        INDIRECT(SUBSTITUTE(ADDRESS(1,MATCH("short_id",participants!$A$1:$ZU$1,0),4), 1, "") & row()),
        INDIRECT("payments!" & SUBSTITUTE(ADDRESS(1,MATCH("amount",payments!$A$1:$ZZ$1,0),4), 1, "") & ":" & SUBSTITUTE(ADDRESS(1,MATCH("amount",payments!$A$1:$ZZ$1,0),4), 1, ""))
    ) = INDIRECT(SUBSTITUTE(ADDRESS(1,MATCH("simple_amount",participants!$A$1:$ZU$1,0),4), 1, "") & row()),
    "Yes",
    IF(SUMIF(
      INDIRECT("payments!" & SUBSTITUTE(ADDRESS(1,MATCH("short_id",payments!$A$1:$ZZ$1,0),4), 1, "") & ":" & SUBSTITUTE(ADDRESS(1,MATCH("short_id",payments!$A$1:$ZZ$1,0),4), 1, "")),
      INDIRECT(SUBSTITUTE(ADDRESS(1,MATCH("short_id",participants!$A$1:$ZU$1,0),4), 1, "") & row()),
      INDIRECT("payments!" & SUBSTITUTE(ADDRESS(1,MATCH("amount",payments!$A$1:$ZZ$1,0),4), 1, "") & ":" & SUBSTITUTE(ADDRESS(1,MATCH("amount",payments!$A$1:$ZZ$1,0),4), 1, ""))
    ) > 0, SUM(SUMIF(
      INDIRECT("payments!" & SUBSTITUTE(ADDRESS(1,MATCH("short_id",payments!$A$1:$ZZ$1,0),4), 1, "") & ":" & SUBSTITUTE(ADDRESS(1,MATCH("short_id",payments!$A$1:$ZZ$1,0),4), 1, "")),
      INDIRECT(SUBSTITUTE(ADDRESS(1,MATCH("short_id",participants!$A$1:$ZU$1,0),4), 1, "") & row()),
      INDIRECT("payments!" & SUBSTITUTE(ADDRESS(1,MATCH("amount",payments!$A$1:$ZZ$1,0),4), 1, "") & ":" & SUBSTITUTE(ADDRESS(1,MATCH("amount",payments!$A$1:$ZZ$1,0),4), 1, ""))
    ) - INDIRECT(SUBSTITUTE(ADDRESS(1,MATCH("simple_amount",participants!$A$1:$ZU$1,0),4), 1, "") & row())), "No"))`;
  // body.paid = '=IF(SUMPRODUCT(EXACT(payments!A:A, INDIRECT("B"&row()))), "Yes", "No")';

    source.sheets.addRowWithHeaders(sheet_id, 'participants', body).
    then(results => {
      res.status(200).json([body]);
    }).catch(err => {
      console.log('Error', err);
      res.status(500).send(err.message);
    });
    */
  // reply.code(httpCodes.OK);
  // return {};
};
