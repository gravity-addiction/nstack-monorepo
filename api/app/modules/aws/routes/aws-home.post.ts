import { getUserById } from '@app/modules/users/controllers/users.info';
import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import * as AwsKeys from '../controllers/aws.keys';
import { addNewHomeUser } from '../controllers/aws.cmd-home';
import { getAWSRequestCreds } from '../controllers/aws.cmd-keys';

export const awsHomePost: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {
  const role = request.rbac.getRole(request.user);
  // const role = (((request.user || {}).role || []).find(r => r.area === '') || config.rbac.defaultRole || { role: ''}).role;
  if (!await request.rbac.can(role, 's3:cloud-home')) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }

  const query: any = request.query || {},
        server = query.server || 'us-west-2',
        rUser = (request.user || {}),
        userId = rUser.id || 0;

  const userCreds = await getAWSRequestCreds(rUser.id).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FETCHING_AWS_LS', _err);
  });

  const userInfo: any = await getUserById(rUser.id).catch((_err: Error) => {
    throw request.generateError(httpCodes.BAD_REQUEST, 'Cannot get User', _err);
  });

  const homeUser = await addNewHomeUser(
    AwsKeys.IAM(userCreds),
    AwsKeys.S3(userCreds),
    userId,
    userInfo.username,
    'cli-only',
    server,
    config.aws.aws_user_id
  ).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_CREATING_AWS_HOME', _err);
  });

  reply.code(httpCodes.CREATED);
  return homeUser;
};
