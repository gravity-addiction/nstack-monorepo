import { getUserById } from '@app/modules/users/controllers/users.info';
import httpCodes from '@inip/http-codes';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import * as AwsKeys from '../controllers/aws.keys';
import { getAWSKeys, getAWSRequestCreds, generateAWSKeysForUser } from '../controllers/aws.cmd-keys';

export const awsKeyGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {

  if (!await request.rbac.can((request.user || {}).role || '', 's3:cloud-home')) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }

  const query: any = request.query || {},
        server = query.server || 'us-west-2',
        rUser = (request.user || {}),
        userId = rUser.id || 0;

  const userInfo: any = await getUserById(rUser.id).catch((_err: Error) => {
    throw request.generateError(httpCodes.BAD_REQUEST, 'Cannot find user', _err);
  });

  let awsKeySet = await getAWSKeys(userId).catch((_err: Error) => {
    throw request.generateError(httpCodes.BAD_REQUEST, 'Cannot get AWS Keys', _err);
  });

  if (!awsKeySet.length) {
    const userCreds = await getAWSRequestCreds(rUser.id).
    catch((_err: Error) => {
      throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FETCHING_AWS_LS', _err);
    });

    awsKeySet = await generateAWSKeysForUser(
      AwsKeys.IAM(userCreds),
      userId
    ).then(() => getAWSKeys(userId));

    reply.code(httpCodes.CREATED);
  } else {
    reply.code(httpCodes.OK);
  }
  return awsKeySet;
};
