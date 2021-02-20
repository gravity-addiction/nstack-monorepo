import { config } from '@lib/config';
import { dateMath } from '@lib/date-math';
import { first, query, upsert } from '@lib/db';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';

export const getReview = (reviewId: number, db?: PoolConnection): Promise<RowDataPacket> => {
  return query<RowDataPacket[]>(
    'SELECT * FROM ?? WHERE `id` = ?',
    [config.squareup.dbTables.squareupFlags, reviewId],
    db
  ).then(resp => first(resp));
};

export const getReviews = (resolved = 0, dStart?: Date, dTill?: Date, db?: PoolConnection): Promise<RowDataPacket[]> => {
  return query<any>('CALL ??(?, ?, ?)',
    [ config.squareup.dbSPs.procFlagged,
      resolved,
      dateMath(dStart),
      dateMath(dTill),
    ],
    db
  ).then((resp: [RowDataPacket[], ResultSetHeader]) => (resp[0] || []));
};

export const createReview = (itemId: string, issue: string, db?: PoolConnection) => {
  return query<ResultSetHeader>(
    'INSERT INTO ?? (`item_id`, `issue`) VALUES (?, ?)',
    [config.squareup.dbTables.squareupFlags, itemId, issue],
    db
  );
};

export const resolveIssue = (id: number, resolved: boolean = true, db?: PoolConnection): Promise<any> => {
  return query<ResultSetHeader>(
    'UPDATE ?? SET `resolved` = ? WHERE `id` = ?',
    [config.squareup.dbTables.squareupFlags, ((resolved) ? 1 : 0), id],
    db
  );
};

export const createOverride = (updateData: any, db?: PoolConnection): Promise<ResultSetHeader> => {
  return upsert(updateData, config.squareup.dbTables.squareupOverrides, [], db);
};
