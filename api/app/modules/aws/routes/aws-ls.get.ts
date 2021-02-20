import httpCodes from '@inip/http-codes';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import * as AwsKeys from '../controllers/aws.keys';
import { getKeySdobData } from '../controllers/aws.file-info';
import { lsFolder as FileSyncLsFolder } from '../controllers/aws.file-sync';
import { getAWSRequestCreds } from '../controllers/aws.cmd-keys';
import { lsFolder as S3LsFolder } from '../controllers/aws.cmd-s3';

export const basicLs = async (userId: any, query: any) => {

  const server = query.server || 'us-west-2',
        bucket = query.bucket || 'sdob-videos',
        key = query.key || '',
        max = query.max || 0,
        startAfter = query.start_after || '',
        continueToken = query.cont || '',
        delimiter = query.delimiter || '/';

// select * from `skydiveorbust`.`s3_file_sync` where `Key` like '2018/%/' and `Key` not like '2018/%/%/'
// select * from `skydiveorbust`.`s3_file_sync` where `Key` like '2018/CF4R/%' and `Key` not like '2018/CF4R/%/%'

  // Only users can access s3, otherwise just anonymous filesync
  const goDirectToS3 = true; // !!(userId);
  let querySQL: any;

  // Direct S3 Lookup
  if (goDirectToS3 && server) {
    const userCreds = await getAWSRequestCreds(userId);

    // Set blank region by querystring, pry should be database specific later
    if (server && !userCreds.region) {
      userCreds.region = server;
    }

    querySQL = S3LsFolder(AwsKeys.S3(userCreds), bucket, key, delimiter, max, startAfter, continueToken);
  // Database Lookup (Cost Less)
  } else {
    const lsResult = await FileSyncLsFolder(server, bucket, key, delimiter, max, startAfter);
    /* eslint-disable @typescript-eslint/naming-convention */
    querySQL = {
      Contents: lsResult.filter((d: any) => d.Size > 0) || [],
      Name: bucket,
      Prefix: key,
      Delimiter: delimiter,
      MaxKeys: max,
      CommonPrefixes: lsResult.filter((d: any) => d.Size === 0) || [],
      KeyCount: lsResult.length,
    };
  }
  return querySQL;
};


export const awsLsGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {
  if (!await request.rbac.can((request.user || {}).role || '', 's3:cloud-home')) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }

  const lsResult = await basicLs((request.user || {}).id, request.query).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FETCHING_AWS_LS', _err);
  });

  if (lsResult.Contents && lsResult.Contents.length) {
    const keyList = lsResult.Contents.map((lrC: any) => lrC.ETag);
    // console.log('eTag', keyList);
    const eTagInfo = await getKeySdobData(keyList);
    // console.log(eTagInfo);
  }

    /* aws users */
    /*
    [
      Tokens.validateToken,
      eRBAC.can(
        async (req: Request, res: Response) => UsersRegister.getRole(req, Tokens.getTokenInfo(req, res).user, 'users'),
        's3:cloud-home'
      )
    ],
    async (req: Request, res: Response) => {
      const userId = Tokens.getTokenInfo(req, res).user;

      if (!userId) {
        return res.status(404).json({error: 'No User Supplied'});
      }

      const query = req.query || {},
            bucket = query.bucket || '',
            server = query.server || '',
            key = query.key || '',
            max = query.max || 0,
            startAfter = query.start_after || '',
            continueToken = query.cont || '';

      const userCreds = await AwsCmdKeys.getAWSRequestCreds(userId);
      if (userCreds[0]) {
        res.status(500).json({error: userCreds[0]});
        return;
      }

      // Set blank region by querystring, pry should be database specific later
      if (server && !userCreds[1].region) { userCreds[1].region = server; }


      AwsCmdS3.lsFolder(AwsKeys.S3(userCreds[1]), bucket, key, max, startAfter, continueToken).
      then(lsResult => {
        if (lsResult[0]) { throw lsResult[0]; }
        res.status(200).json(lsResult[1]);
      }).catch(err => {
        res.status(500).json({error: err});
      });
    }
    */
  reply.code(httpCodes.OK);
  return lsResult;
};
