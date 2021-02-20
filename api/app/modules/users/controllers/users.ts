import { config } from '@lib/config';
import { query } from '@lib/db';
import { PoolConnection, ResultSetHeader } from 'mysql2';

export const cleanUsername = (username: string, db?: PoolConnection): Promise<ResultSetHeader> =>
  query<ResultSetHeader>(
    'UPDATE ?? SET `username` = NULL WHERE `username` = ?',
    [config.auth.dbTables.users, username],
    db
  );
