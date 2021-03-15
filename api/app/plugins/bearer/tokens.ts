import { config } from '../../../lib/config';
import { first, query } from '../../../lib/db';
import { uuidv4 } from '../../../lib/uuid';
import { sign as jwtSign, verify as jwtVerify } from 'jsonwebtoken';
import { ResultSetHeader, RowDataPacket } from 'mysql2';


export const stripToken = (token: string): string => token.substring(token.indexOf('.') + 1);

export const unstripToken = (token: string): string => `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${token}`;

export const insertToken = (user: string, jti: string, ip: string = '', useragent: string | string[] = ''): Promise<any> =>
  query<ResultSetHeader>(
    'INSERT INTO ?? (`user`, `ip`, `useragent`, `jti`, `valid`) VALUES (?, ?, ?, ?, ?)',
    [config.auth.dbTables.tokens, user, ip, useragent, jti, 1]
  );

export const updateToken = (jti: string): Promise<any> =>
  query<ResultSetHeader>(
    'UPDATE ?? SET `updatedAt` = CURRENT_TIMESTAMP WHERE `jti` = ? AND `valid` = ? LIMIT 1',
    [config.auth.dbTables.tokens, jti, 1]
  );

export const deleteToken = (jti: string): Promise<any> =>
  query<ResultSetHeader>(
    'UPDATE ?? SET `valid` = 0, `updatedAt` = CURRENT_TIMESTAMP WHERE `jti` = ?',
    [config.auth.dbTables.tokens, jti]
  );

// Find Token in Database
export const findToken = (token: string): Promise<any> =>
  updateToken(token).
  then(() => query<RowDataPacket[]>(
    'SELECT `user`, `ip`, `userAgent` FROM ?? WHERE `jti` = ? AND `valid` = ? LIMIT 1',
    [config.auth.dbTables.tokens, token, 1]
  )).
  then(resp => first(resp));


// Sign JWT Token
export const signToken = (body: any): string => {
  const tokenTimeout = config.auth.jwtTimeout,
        tokenSecret = config.auth.jwtSecret || 'specifyJWTSECRETinConfig';

  return jwtSign(body, tokenSecret, { expiresIn: tokenTimeout });
};

export const resignToken = (body: any): string => {
  delete body.exp;
  delete body.iat;
  return signToken(body);
};

// Creates new Token and Inserts DB record
export const createToken = (body: any, ip: string = '', useragent: string | string[] = ''): Promise<string> => {
  if (!body.id) {
    throw new Error('No User ID');
  }

  body.jti = uuidv4();
  const token = signToken(body);

  return insertToken(body.id as string, body.jti, ip, useragent).
         then(() => token);
};


export const getTokenInfo = (token: string, checkExpired: boolean = true): any => {
  const tokenSecret = config.auth.jwtSecret || 'specifyJWTSECRETinConfig',
        verifyOptions = {
          ignoreExpiration: !checkExpired,
        };

  try {
    const userInfo = jwtVerify(unstripToken(token), tokenSecret, verifyOptions);
    return userInfo;
  } catch (err) {
    return false;
  }
};

// Validate JWT Token
export const validateToken = async (token: string): Promise<any> => {
  if (!token) {
    throw new Error('No Token');
  } else {
    const tokenSecret = config.auth.jwtSecret || 'specifyJWTSECRETinConfig',
          verifyOptions = {
            ignoreExpiration: true,
          };

    let userInfo: any;
    try {
      userInfo = jwtVerify(unstripToken(token), tokenSecret, verifyOptions);
    } catch (err) {
      throw err;
    }

    const curTime = Math.floor((new Date()).getTime() / 1000),
          tokenExp = userInfo.exp || 0;

    const tokenInfo = await findToken(userInfo.jti);
    if (tokenInfo && tokenInfo.user && userInfo && (tokenExp > curTime)) {
      // Token Valid, Not Expired
      // console.log('Not Expired');
      return Promise.resolve([false, userInfo]);

    } else if (tokenInfo && tokenInfo.user && userInfo && tokenExp <= curTime) {
      // Refresh Token
      // console.log('Needs Refreshing');
      const updateInfo: ResultSetHeader = await updateToken(userInfo.jti);

      if ((updateInfo || {}).affectedRows) {
        return Promise.resolve([true, userInfo]);
      } else {
        // console.log('Cannot Update Token');
        throw new Error('Token Server Failure');
      }

    } else {
      // Token is Dead
      // console.log('Token Dead!');
      return Promise.resolve([false, false]);
    }

  }
};
