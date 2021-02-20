import { config } from '@lib/config';
import { first, insert, query } from '@lib/db';
import { PoolConnection, RowDataPacket } from 'mysql2';

export const getEventTeamsByComp = (eventSlug?: string, compId?: number, db?: PoolConnection): Promise<RowDataPacket[]> =>
  query<RowDataPacket[]>(
    'SELECT * FROM ?? WHERE `compId` = ? OR `compId` IN (' +
      'SELECT id FROM ?? WHERE eventId = (' +
        'SELECT id FROM ?? WHERE slug = ?' +
      ')' +
    ') ORDER BY compTotal DESC, allTotal DESC, teamNumber',
    [config.events.dbTables.eventTeam, compId, config.events.dbTables.eventComp, config.events.dbTables.event, eventSlug],
    db
  ).then((r: RowDataPacket[]): RowDataPacket[] => r.map(rr => {
    rr.scores = JSON.parse(rr.scores) || [];
    return rr;
  }));


export const getEventTeam = (id?: number, db?: PoolConnection): Promise<RowDataPacket> =>
  query<RowDataPacket[]>(
    'SELECT * FROM ?? WHERE `id` = ? LIMIT 0, 1',
    [config.events.dbTables.eventTeam, id],
    db
  ).
  then((r: RowDataPacket[]): RowDataPacket => first(r)).
  then((r: RowDataPacket): RowDataPacket => {
    r.scores = JSON.parse(r.scores) || [];
    return r;
  });


export const createEventTeam = async (body: any, db?: PoolConnection): Promise<RowDataPacket> => {
  const insertData: any = {
    compId: body.compId,
    teamNumber: body.teamNumber || '',
    name: body.teamName || '',
  };

  const teamInfo = await insert(insertData, config.events.dbTables.eventTeam, db);
  return getEventTeam(teamInfo.insertId, db);
};
