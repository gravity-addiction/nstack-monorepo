import { config } from '@lib/config';
import { insert, query, upsert } from '@lib/db';
import { createHash } from 'crypto';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';
import { characters as shortidCharacters, generate as shortidGenerate } from 'shortid32';

export const rpiGenerateShortId = async (body: any, db?: PoolConnection): Promise<string> => {

  const dataSet: any = {
    dserial: body.s || '',
    dmodel: body.m || '',
    drevision: body.r || '',
    hostname: body.h || '',
    publicip: body.ip || '',
    eth0v4: body.e4 || '',
    eth0v6: body.e6 || '',
    wifi0v4: body.w4 || '',
    wifi0v6: body.w6 || '',
    hash: 'secretsalting',
  };

  dataSet.hash = createHash('sha256').update(JSON.stringify(dataSet)).digest('hex');

  // dataSet.hash = hashSync(JSON.stringify(dataSet), 10).replace('$2a$10$', '');
  const preCheck = await query<RowDataPacket[]>(
    'SELECT `short_id` FROM ?? WHERE `hash` = ? LIMIT 1',
    [config.rpi.dbTables.codes, dataSet.hash],
    db
  );

  let shortOk = 0;
  let shortTry = 0;
  if (preCheck.length) {
    dataSet.short_id = preCheck[0].short_id;
    shortOk = 1;
    await upsert(dataSet, config.rpi.dbTables.codes).then(() => {});

  } else {

    // Generate ShortID for Event
    shortidCharacters(config.rpi.shortidChars || config.shortidChars || '23456789ABCDEFGHJKLMNPQRSTUVWXYZ');
    const searchWords = config.rpi.shortidRemovewords || config.shortidRemovewords || '';
    const searchExp = new RegExp(searchWords.split(',').join('|'), 'gi');

    const shortCasesensitive = config.rpi.shortidCasesensitive || config.shortidCasesensitive || false;
    const shortAllowedAttempts = config.rpi.shortidAttempts || config.shortidAttempts || 50;
    while (!shortOk && shortTry < shortAllowedAttempts) {
      shortTry += 1;
      dataSet.short_id = shortidGenerate();

      if (!shortCasesensitive) {
        dataSet.short_id = dataSet.short_id.toUpperCase();
      }
      while (searchExp.test(dataSet.short_id)) {
        continue;
      }

      const shortCheck = await query<RowDataPacket[]>(
        'SELECT `short_id` FROM ?? WHERE `short_id` = ? LIMIT 1',
        [config.rpi.dbTables.codes, dataSet.short_id],
        db
      );
      if (shortCheck && shortCheck.length) {
        continue;
      }
      shortOk = await insert(dataSet, config.rpi.dbTables.codes).
  //    shortOk = await query<ResultSetHeader>(
  //      'INSERT INTO ?? (`short_id`, `dserial`, `dmodel`, `drevision`) VALUES (?, ?, ?, ?)',
  //      [config.rpi.dbTables.codes, shortId, serialNum, modelNum, revisionNum],
  //      db
  //    ).
      then((r: ResultSetHeader): number => r.affectedRows);
    }
    if (!shortOk) {
      return '';
    }
  }

  return dataSet.short_id;
};
