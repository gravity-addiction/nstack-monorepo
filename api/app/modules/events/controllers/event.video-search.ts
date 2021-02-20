import { config } from '@lib/config';
import { first, query } from '@lib/db';
import { PoolConnection,  RowDataPacket } from 'mysql2';


export const getEventVideoFromSDOBox = (eventSlug: string, compId: number, teamNumber: string, rnd: number, db?: PoolConnection
      ): Promise<RowDataPacket> => {
  let sql = '';
  const val: (string | number)[] = [];

  sql += 'SELECT id FROM ?? WHERE ';
  val.push(config.events.dbTables.eventVideos);
  sql += 'eventId IN ( ';
    sql += 'SELECT id FROM ?? WHERE slug = ? ';
    val.push(config.events.dbTables.events, eventSlug);
  sql += ') AND ';
  sql += 'teamId IN ( ';
    sql += 'SELECT id FROM ?? WHERE compId = ? AND teamNumber = ? ';
    val.push(compId, teamNumber);
  sql += ') AND roundNum = ? ';
  val.push(rnd);

  return query<RowDataPacket[]>(sql, val, db).
  then((rA: RowDataPacket[]) => first(rA));
};

export const getEventVideoByCompInfo = (meet?: string, team?: string, rnd?: string, db?: PoolConnection): Promise<number> => {
  let sql = '';
  const val: (string | number)[] = [];

  sql += 'SELECT id FROM ?? WHERE ';
  val.push(config.events.dbTables.eventVideos);
  if (meet) {
    sql += 'eventId IN ( ';
      sql += 'SELECT id FROM ?? WHERE slug = ? ';
      val.push(config.events.dbTables.event, meet);
    sql += ') ';

  } else if (team && rnd) {
    sql += 'teamId = ? AND roundNum = ? ';
    val.push(team, rnd);

  } else {
    throw new Error('Error, cannot find scroresheets, not enough information provided.');
  }

  return query<RowDataPacket[]>(sql, val, db).
  then((rA: RowDataPacket[]) => first(rA)).
  then((rA: RowDataPacket): number => rA.id );
};
