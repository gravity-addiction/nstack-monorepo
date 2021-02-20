import { config } from '@lib/config';
import { first, insert, query } from '@lib/db';
import { IAM } from 'aws-sdk';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';

import { createAccessKey, deleteAccessKey } from './aws.cmds';

export const getAWSKeys = (userId: string, db?: PoolConnection): Promise<RowDataPacket[]> =>
  query<RowDataPacket[]>(
    'SELECT `aws_key` FROM ?? WHERE `user` = ?',
    [config.aws.dbTables.awsKeys, userId],
    db
  );

export const getAWSKeySecret = (userId: string, key: string, db?: PoolConnection): Promise<RowDataPacket> =>
  query<RowDataPacket[]>(
    'SELECT `aws_secret` FROM ?? WHERE `user` = ? AND `aws_key` = ?',
    [config.aws.dbTables.awsKeys, userId, key],
    db
  ).then((r: RowDataPacket[]) => first(r));

export const getAWSRequestCreds = (userId: string, db?: PoolConnection): Promise<RowDataPacket> =>
  // Same Request Creds During Initial Period
  // if (!userId) {
    /* eslint-disable @typescript-eslint/naming-convention */
    Promise.resolve({
      aws_access_key_id: config.aws.aws_public_key,
      aws_secret_access_key: config.aws.aws_public_secret,
      region: config.aws.aws_public_region,
    } as RowDataPacket);
  // }
  /* return query<RowDataPacket[]>(
    'SELECT `aws_key` as aws_access_key_id, `aws_secret` as aws_secret_access_key FROM ?? WHERE `user` = ?',
    [config.aws.dbTables.awsKeys, userId],
    db
  ).then((r: RowDataPacket[]) => first(r));
  */

export const getAWSPostCreds = (userId: string, db?: PoolConnection): Promise<RowDataPacket> =>
  // Same Request Creds During Initial Period
  // if (!userId) {
    /* eslint-disable @typescript-eslint/naming-convention */
    Promise.resolve({
      aws_access_key_id: config.aws.aws_access_key_id,
      aws_secret_access_key: config.aws.aws_secret_access_key,
      region: config.aws.aws_public_region,
    } as RowDataPacket);
  // }
  /* return query<RowDataPacket[]>(
    'SELECT `aws_key` as aws_access_key_id, `aws_secret` as aws_secret_access_key FROM ?? WHERE `user` = ?',
    [config.aws.dbTables.awsKeys, userId],
    db
  ).then((r: RowDataPacket[]) => first(r));
  */

export const removeAWSKeys = async (iam: IAM, userId: string, key: string, db?: PoolConnection): Promise<ResultSetHeader> => {
  const keyInfo: RowDataPacket = await query<RowDataPacket[]>(
    'SELECT `id`, `aws_user` FROM ?? WHERE `user` = ? AND `aws_key` = ?',
    [config.aws.dbTables.awsKeys, userId],
    db
  ).then((r: RowDataPacket[]) => first(r));

  if (!keyInfo || !keyInfo.aws_user) {
    throw new Error('No AWS Key in database');
  }

  await deleteAccessKey(iam, keyInfo.aws_user, key);
  return query<ResultSetHeader>(
    'DELETE FROM ?? WHERE `aws_user` = ? AND `aws_key` = ?',
    [config.aws.dbTables.awsKeys, keyInfo.aws_user, key],
    db
  );
};

export const generateAWSKeysForUser = async (iam: IAM, userId: string, db?: PoolConnection): Promise<any> => {
  const userInfo: RowDataPacket = await query<RowDataPacket[]>(
    'SELECT `aws_user` FROM ?? WHERE `user` = ?',
    [config.aws.dbTables.awsUsers, userId],
    db
  ).then((r: RowDataPacket[]) => first(r));

  if (!userInfo) {
    throw new Error('No AWS User Created For This Account');
  }

  const accessKeyInfo: any = await createAccessKey(iam, userInfo.aws_user);
  const accessKey = accessKeyInfo.AccessKey;

  /* eslint-disable @typescript-eslint/naming-convention */
  return insert({
    user: userId,
    aws_user: accessKey.UserName,
    aws_key: accessKey.AccessKeyId,
    aws_secret: accessKey.SecretAccessKey,
  }, config.aws.dbTables.awsKeys, db);
};
