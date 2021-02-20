import { config } from '@lib/config';
import { first, query } from '@lib/db';
import { generateRandomString } from '@lib/fisher-yates-shuffle';
import { compareSync, hashSync } from 'bcryptjs';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';

export const comparePassword = (userPassword: string, hashedPassword: string): boolean =>
  compareSync((userPassword || '').toString(), (hashedPassword || '').toString());

export const hashPassword = (password: string): string =>
  hashSync(password.toString(), 10);

export const authenticateUser = async (username: string, password: string, db?: PoolConnection): Promise<number> =>
  query<RowDataPacket[]>(
    'SELECT `id`, `password` FROM ?? WHERE `username` = ? LIMIT 1',
    [config.auth.dbTables.users, username],
    db
  ).
  then(resp => first(resp)).
  then((resp: any) => {
    if (!resp) {
      // Cannout Find Account
      return 0;

    // Allow blank password logins
    } else if (resp.password === null && !password) {
      return resp.id;

    // Compare password hashes
    } else if (comparePassword(password, resp.password)) {
      return resp.id;
    } else {
      // Account Found, Password Doesn't Compare
      return 0;
    }
  });

export const authenticateAuthKeyGenerate = (): string => {
  let key = '';

  const numEntries = parseInt(generateRandomString(1, '456789'.split('')), 10) || 5;
  for (let i = 0; i < numEntries; i++) {
    const numChar = parseInt(generateRandomString(1, '456789'.split('')), 10) || 5;
    if (key !== '') {
      key = key + '-';
    }
    key = key + generateRandomString(numChar, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~:[]@!$()*,;'.split(''));
  }

  const str = Date.now().toString() + key;
  return hashSync(str, 10).replace('$2a$10$', '');
};

export const authenticateUserKeyLastUsed = async (authKeyId: number, db?: PoolConnection): Promise<RowDataPacket[]> =>
  query<RowDataPacket[]>(
    'UPDATE ?? SET last_used = CURRENT_TIMESTAMP() WHERE `id` = ? LIMIT 1',
    [config.auth.dbTables.usersAutologin, authKeyId],
    db
  );

export const authenticateUserKey = async (authKey: string, db?: PoolConnection): Promise<number> =>
  query<RowDataPacket[]>(
    'SELECT `id`, `userid` FROM ?? WHERE `key` = ? LIMIT 1',
    [config.auth.dbTables.usersAutologin, authKey],
    db
  ).
  then(resp => first(resp)).
  then(async (resp: any) => {
    if (!resp) {
      // Cannout Find Account
      return 0;
    } else {
      await authenticateUserKeyLastUsed(resp.id, db).catch((_err: Error) => _err);
      return resp.userid;
    }
  });

export const setUserChangePassword = (id: number, v: boolean, db?: PoolConnection): Promise<ResultSetHeader> =>
  query<ResultSetHeader>(
      'UPDATE ?? SET `changepass` = ? WHERE `id` = ?',
      [config.auth.dbTables.users, (v) ? 1 : 0, id],
      db
  );

export const resetChangePassword = (userId: number, db?: PoolConnection): Promise<string> => {
  let newPassword = Math.floor(Math.random() * 10000).toString();
  while (newPassword.length < 4) {
    newPassword = newPassword + '0';
  }

  const hashed = hashPassword(newPassword);
  return query<ResultSetHeader>(
    'UPDATE ?? SET `password` = ?, `changepass` = 1 WHERE `id` = ?',
    [config.auth.dbTables.users, hashed, userId],
    db
  ).then((result: ResultSetHeader) => {
    if (result.affectedRows) {
      return newPassword;
    } else {
      return '';
    }
  });
};

export const updateUserPassword = (userId: number, password: string, db?: PoolConnection): Promise<ResultSetHeader> => {
  if (password === '') {
    throw new Error('no_blank_passwords');
  }
  const hashed = hashPassword(password);

  return query<ResultSetHeader>(
    'UPDATE ?? SET `password` = ? WHERE `id` = ?',
    [config.auth.dbTables.users, hashed, userId],
    db
  );
};
