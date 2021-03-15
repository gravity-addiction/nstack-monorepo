import { config } from '@lib/config';
import { first, query } from '@lib/db';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';

// Get All Roles for User
export const getUserRoles = (id: number, db?: PoolConnection): Promise<any> =>
  query<RowDataPacket[]>('SELECT `area`, `role` FROM ?? WHERE `user` = ? LIMIT 1', [config.auth.dbTables.roles, id], db).
  then(resp => resp.reduce((map: any, obj: any) => (map[((obj.area) ? obj.area : 'global')] = obj.role, map), {}));

export const addRole = (id: number, role: string, area: string = '', db?: PoolConnection): Promise<ResultSetHeader> =>
  query<ResultSetHeader>(
      'INSERT INTO ?? (`area`, `role`, `user`) VALUES (?, ?, ?)',
       [config.auth.dbTables.roles, area, role, id],
       db
  );

export const getRoles = async (id: number, db?: PoolConnection): Promise<RowDataPacket[]> => {

  if (!id) {
    return Promise.resolve([] as RowDataPacket[]);
  }

  return query<RowDataPacket[]>('SELECT `role`, `area` FROM ?? WHERE `user` = ?',
    [ config.auth.dbTables.roles, id],
    db
  );
};
