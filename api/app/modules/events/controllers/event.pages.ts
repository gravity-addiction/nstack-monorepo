import { config } from '@lib/config';
import { first, insert, query } from '@lib/db';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';

export const getEventPage = (eventId: number, page: string, db?: PoolConnection): Promise<RowDataPacket> =>
  query<RowDataPacket[]>(
    'SELECT content FROM ?? WHERE `eventId` = ? AND page = ? ORDER BY datestamp DESC LIMIT 1',
    [config.events.dbTables.eventPages, eventId, page],
    db
  ).then((r: RowDataPacket[]): RowDataPacket => first(r));


export const getEventPageHistory = (eventId: number, page: string, db?: PoolConnection): Promise<RowDataPacket[]> =>
  query<RowDataPacket[]>(
    'SELECT id, datestamp FROM ?? WHERE `eventId` = ? AND page = ? ORDER BY datestamp DESC LIMIT 0, 100',
    [config.events.dbTables.eventPages, eventId, page],
    db
  );


export const getEventPageById = (eventId: number, pageId: number, db?: PoolConnection): Promise<RowDataPacket> =>
  query<RowDataPacket[]>(
    'SELECT content FROM ?? WHERE `eventId` = ? AND `id` = ?',
    [config.events.dbTables.eventPages, eventId, pageId],
    db
  ).then((r: RowDataPacket[]): RowDataPacket => first(r));


export const eventPagesInsert = (eventId: number, page: string, content: string, db?: PoolConnection) =>
  insert({ eventId, page, content }, config.events.dbTables.eventPages, db);
