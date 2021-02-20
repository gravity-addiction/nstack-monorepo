import { config } from '@lib/config';
import { first, insert, query } from '@lib/db';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';

export const getEventComps = (eventId: number, db?: PoolConnection): Promise<RowDataPacket[]> =>
  query<RowDataPacket[]>(
    'SELECT * FROM ?? WHERE `eventId` = ?',
    [config.events.dbTables.eventComp, eventId],
    db
  ); // .then((r: RowDataPacket[]): RowDataPacket => first(r));


export const getEventWithComps = (eventSlug: string, db?: PoolConnection): Promise<RowDataPacket[]> =>
  query<RowDataPacket[]>(
      'SELECT *, ??.id as compId FROM ?? LEFT JOIN ?? ON ??.eventId = ??.id WHERE slug = ?',
      [config.events.dbTables.eventComp, config.events.dbTables.event, config.events.dbTables.eventComp,
        config.events.dbTables.eventComp, config.events.dbTables.event,
        eventSlug],
      db
  ); // .then((rA: RowDataPacket[]) => rA.map((r: RowDataPacket) => dbEvent(r)));
