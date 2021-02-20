import { config } from '@lib/config';
import { first, insert, query, update } from '@lib/db';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';

import { hashPassword } from './users.password';

// Get All Roles for User
export const getUserById = (id: number, db?: PoolConnection): Promise<RowDataPacket> =>
  query<RowDataPacket[]>(
      'SELECT `id`, `sdobn`, `name`, `username`, `changepass` FROM ?? WHERE `id` = ? LIMIT 1',
      [config.auth.dbTables.users, id],
      db
  ).
  then(resp => first(resp));


// Get list of All Users
export const getAllUsers = (db?: PoolConnection): Promise<RowDataPacket[]> =>
  query<RowDataPacket[]>(
    'SELECT `id`, `sdobn`, `name`, `username` FROM ?? ORDER BY `name`',
    [config.auth.dbTables.users],
    db
  );


export const userCheck = async (username: string, id?: number, db?: PoolConnection): Promise<boolean> => {
  let sql = '';
  const values: (string | number)[] = [];

  if (username === '') {
    return false;
  }

  sql += 'SELECT * FROM ?? WHERE `username` = ? ';
  values.push(...[config.auth.dbTables.users, username]);

  if (id) {
    sql += 'AND `id` != ? ';
    values.push(id);
  }

  const usernameCheck = await query<RowDataPacket[]>(sql, values, db);
  if (usernameCheck && usernameCheck.length) {
    return false;
  }
  return true;
};

export const createUser = async (body: any, db?: PoolConnection): Promise<RowDataPacket> => {
  if (!body.password) {
    body.password = Math.floor(Math.random() * 1000000).toString();
    while (body.password.length < 8) {
      body.dpassword = body.dpassword + '0';
    }
  } else {
    body.dpassword = body.password;
  }

  const insertData: any = {
    name: body.name || '',
    sdobn: body.sdobn || '',
    password: hashPassword(body.dpassword),
    username: body.username,
  };

  const checked = await userCheck(insertData.username, 0, db);
  if (!checked) {
    throw new Error('duplicate_username');
  }

  const userId = await insert(insertData, config.auth.dbTables.users, db);
  const userData = await getUserById(userId.insertId, db);
  if (!body.password) {
    userData.password = body.dpassword;
  }
  return userData;
};

export const updateUserInfo = async (id: number, body: any, db?: PoolConnection): Promise<RowDataPacket> => {
  const updateData: any = {
    username: null,
  };

  if (body.hasOwnProperty('name') && body.name !== '') {
    updateData.name = body.name;
  }
  if (body.hasOwnProperty('sdobn')) {
    updateData.sdobn = body.sdobn;
  }
  if (body.hasOwnProperty('username') && body.username !== '') {
    updateData.username = body.username;
  }
  if (!updateData.username) {
    updateData.username = null;
  }

  if (Object.keys(updateData).length) {
    const checked = await userCheck(updateData.username, id, db);
    if (!checked) {
      throw new Error('duplicate_username');
    }
    await update(updateData, config.auth.dbTables.users, id, db);
  }
  return getUserById(id);
};

export const deleteUser = (userId: number, db?: PoolConnection): Promise<ResultSetHeader> =>
  query<ResultSetHeader>(
    'DELETE FROM ?? WHERE `id` = ?',
    [config.auth.dbTables.users, userId],
    db
  );
