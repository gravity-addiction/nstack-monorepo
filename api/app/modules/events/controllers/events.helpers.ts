import { config } from '@lib/config';
import { query } from '@lib/db';
import { PoolConnection, RowDataPacket } from 'mysql2';
import { characters as shortidCharacters, generate as shortidGenerate } from 'shortid32';


export const eventsGenerateShortId = async (db?: PoolConnection): Promise<string> => {
  // Generate ShortID for Event
  shortidCharacters(config.events.shortidChars || config.shortidChars || '23456789ABCDEFGHJKLMNPQRSTUVWXYZ');
  const searchWords = config.events.shortidRemovewords || config.shortidRemovewords || '';
  const searchExp = new RegExp(searchWords.split(',').join('|'), 'gi');

  let shortOk = false;
  let shortTry = 0;
  let shortId = '';
  const shortCasesensitive = config.events.shortidCasesensitive || config.shortidCasesensitive || false;
  const shortAllowedAttempts = config.events.shortidAttempts || config.shortidAttempts || 50;
  while (!shortOk && shortTry < shortAllowedAttempts) {
    shortTry += 1;
    shortId = shortidGenerate();

    if (!shortCasesensitive) {
      shortId = shortId.toUpperCase();
    }
    while (searchExp.test(shortId)) {
      continue;
    }

    const shortCheck = await query<RowDataPacket[]>(
      'SELECT `id` FROM ?? WHERE `short_id` = ? LIMIT 1',
      [config.events.dbTables.event, shortId],
      db
    );
    if (shortCheck && shortCheck.length) {
      continue;
    }
    shortOk = true;
  }
  if (!shortOk) {
    return '';
  }
  return shortId;
};

export const sanitizeContent = (content: string): string => content.replace(/^\s+|\s+$/g, '');
