import { config } from '@lib/config';
import { dateToMysql } from '@lib/date-to-mysql';
import { first, insert, query, update, upsert } from '@lib/db';
import { generateRandomString } from '@lib/fisher-yates-shuffle';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';
import { post as requestPost } from 'request';


export const spotifyGenerateShortId = async (serialNum: string, modelNum: string, revisionNum: string,
                                             db?: PoolConnection): Promise<string> => {

  // Generate ShortID for Event
//  shortid.characters(config.spotify.shortidChars || config.shortidChars || '23456789ABCDEFGHJKLMNPQRSTUVWXYZ');
  const searchWords = config.spotify.shortidRemovewords || config.shortidRemovewords || '';
  const searchExp = new RegExp(searchWords.split(',').join('|'), 'gi');

  let shortOk = 0;
  let shortTry = 0;
  let shortId = '';
  const shortCasesensitive = config.spotify.shortidCasesensitive || config.shortidCasesensitive || false;
  const shortAllowedAttempts = config.spotify.shortidAttempts || config.shortidAttempts || 50;
  while (!shortOk && shortTry < shortAllowedAttempts) {
    shortTry += 1;
    shortId = generateRandomString(5, '23456789ABCDEFGHJKLMNPQRSTVWXYZ'.split('')); // shortid.generate();

    if (!shortCasesensitive) {
      shortId = shortId.toUpperCase();
    }
    while (searchExp.test(shortId)) {
      continue;
    }

    const shortCheck = await query<RowDataPacket[]>(
      'SELECT `short_id` FROM ?? WHERE `short_id` = ? LIMIT 1',
      [config.spotify.dbTables.codes, shortId],
      db
    );
    if (shortCheck && shortCheck.length) {
      continue;
    }

    shortOk = await query<ResultSetHeader>(
      'INSERT INTO ?? (`short_id`, `dserial`, `dmodel`, `drevision`) VALUES (?, ?, ?, ?)',
      [config.spotify.dbTables.codes, shortId, serialNum, modelNum, revisionNum],
      db
    ).then((r: ResultSetHeader): number => r.affectedRows);
  }
  if (!shortOk) {
    return '';
  }
  return shortId;
};

export const spotifyAccessTokenFetch = (code: string, db?: PoolConnection): Promise<any> =>
  // console.log('Fetching', config.spotify.clientId, config.spotify.clientSecret);
  // console.log(Buffer.from(config.spotify.clientId + ':' + config.spotify.clientSecret).toString('base64'));
  new Promise((resolve, reject) => {
    /* eslint-disable @typescript-eslint/naming-convention */
    requestPost(config.spotify.tokenUrl, {
      form: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.spotify.tokenCallbackUrl,
      },
      headers: {
        Authorization: 'Basic ' + Buffer.from(config.spotify.clientId + ':' + config.spotify.clientSecret).toString('base64'),
      },
    }, (err: any, res: any, body: any) => {
      if (err) {
        console.error(`problem with request: ${err.message}`);
        reject(err);
      } else {
        let json = body;
        try {
          json = JSON.parse(body);
        } catch (e) {
          json = body;
        }

        // console.log(json);
        resolve({status: res.statusCode, headers: res.headers, data: json});
      }
    });
  });


export const spotifyAccessTokenSave = (state: string, data: any, db?: PoolConnection): Promise<any> => {
  console.log('Saving', state);
  console.log(data);

/*
  data: {
    access_token: '',
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: '',
    scope: 'user-modify-playback-state user-read-playback-state user-read-currently-playing'
  }
*/

  const expireDate = new Date();
  expireDate.setMinutes(expireDate.getMinutes() + 57);

  /* eslint-disable @typescript-eslint/naming-convention */
  return upsert({
    state,
    token_type: data.token_type,
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    scope: data.scope,
    expire_date: dateToMysql(expireDate),
  }, config.spotify.dbTables.tokens);
};
