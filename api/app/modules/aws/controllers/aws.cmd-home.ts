import { config } from '@lib/config';
import { first, insert, query } from '@lib/db';
import { IAM, S3 } from 'aws-sdk';
import { PoolConnection, RowDataPacket } from 'mysql2';

import { addUserToGroup, checkUser, createUser, putObject } from './aws.cmds';

export const getHomeUser = (userId: string): Promise<RowDataPacket> =>
  query<RowDataPacket[]>(
    'SELECT *, (SELECT COUNT(`id`) FROM ?? WHERE user=?) AS aws_keycount FROM ?? WHERE `user` = ? LIMIT 1',
    [config.aws.dbTables.awsKeys, userId, config.aws.dbTables.awsUsers, userId]
  ).then((r: RowDataPacket[]) => first(r));


export const addNewHomeUser = async (iam: IAM, s3: S3, userId: string, username: string,
                                     usergroup = 'cli-only', server = 'us-west-2', parentId = '',
                                     db?: PoolConnection
) => {

  console.log('Username', username);
  console.log('userId', userId);
  const dbUserCheck = await query<RowDataPacket[]>(
    'SELECT `id` FROM ?? WHERE `aws_user` = ? LIMIT 1',
    [config.aws.dbTables.awsUsers, username],
    db
  );
  // Local DB User Check
  if (dbUserCheck.length) {
    throw new Error('username_exists');
  }

  // AWS Check
  const res: any = await checkUser(iam, username).
  catch((err) => {
    console.log('No User Created, Yet'); return [err];
  });

  if ((res[0] || {}).code === 'NoSuchEntity') {
    const userBucket = 'sdob-user-upload';
    const userFolder = 'home/' + username + '/';

    const userCreated: any = await createUser(iam, username);
    console.log('userCreated', userCreated);

    /* eslint-disable @typescript-eslint/naming-convention */
    await insert({
      user: userId,
      aws_user: username,
      aws_bucket: userBucket || '',
      aws_home_folder: userFolder || '',
      aws_region: server || '',
      aws_parent_id: parentId || '',
      aws_user_id: userCreated.UserId || '',
      aws_arn: userCreated.Arn || '',
      aws_user_path: userCreated.Path || '',
      aws_user_tags: JSON.stringify(userCreated.tags || []),
    }, config.aws.dbTables.awsUsers, db);

    await addUserToGroup(iam, username, usergroup);
    await putObject(s3, userBucket, userFolder, Buffer.alloc(0), '');
    return getHomeUser(userId);
  }
  // console.log('Username ' + username + ' Already Exists');
  throw new Error('username_exists');
};
