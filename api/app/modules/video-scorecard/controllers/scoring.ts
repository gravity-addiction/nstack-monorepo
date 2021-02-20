import { config } from '@lib/config';
import { first, query } from '@lib/db';
import { IEventVideoScorecard, ResultsEventVideoScorecard } from '@typings/index';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';

export const toEventVideoScorecard = (r: ResultsEventVideoScorecard): IEventVideoScorecard =>
  ({
    name: r.name,
    marks: JSON.parse(r.marks) || [],
    prestartTime: {
      start: r.prestartTimeStart,
      end: r.prestartTimeEnd,
    },
    workingTime: {
      start: r.workingTimeStart,
      end: r.workingTimeEnd,
    },
  });

export const getScoringByHash = (hash: string, db?: PoolConnection): Promise<IEventVideoScorecard> =>
  query<RowDataPacket[]>(
      'SELECT * FROM ?? WHERE `hash` = ? LIMIT 1',
      [config.records.dbTables.uspaRecords, hash],
      db
  ).
  then((resp: RowDataPacket[]) => first(resp)).
  then((resp: RowDataPacket) => toEventVideoScorecard(resp as ResultsEventVideoScorecard));
