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

export const getRole = async (id: number, area: string = '', db?: PoolConnection): Promise<RowDataPacket> => {

  if (!id) {
    return Promise.resolve({ role: '' } as RowDataPacket);
  }

  return query<RowDataPacket[]>('SELECT `role` ' +
                    'FROM ?? ' +
                    'WHERE (`user` = ? and `area` = ?) ' +
                    'UNION ALL ' +
                      'SELECT `role` FROM ?? ' +
                      'WHERE (`user` = ? and `area` = ?) ' +
                      'and not exists (' +
                        'SELECT 1 from ?? ' +
                        'WHERE (`user` = ? and `area` = ?)' +
                      ') ' +
                  'LIMIT 1',
        [ config.auth.dbTables.roles, id, area,
          config.auth.dbTables.roles, id, area,
          config.auth.dbTables.roles, id, area,
        ],
        db
  ).then((resp: any) => first(resp));
};
