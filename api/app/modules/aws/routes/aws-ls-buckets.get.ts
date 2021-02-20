import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import * as AwsKeys from '../controllers/aws.keys';
import { getAWSRequestCreds } from '../controllers/aws.cmd-keys';
import { lsBuckets as S3LsBuckets } from '../controllers/aws.cmd-s3';

export const awsLsBucketsGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {

  if (!await request.rbac.can((request.user || {}).role || '', 'video:url-sign')) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }
  const query: any = request.query || {},
        server = query.server || config.aws.aws_public_region || 'us-west-2';

  const userCreds = await getAWSRequestCreds((request.user || {}).id).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FETCHING_AWS_LS', _err);
  });

  if (!userCreds) {
    throw request.generateError(httpCodes.UNAUTHORIZED, 'ERROR_NO_USER_AWS_LS');
  }

  // Set blank region by querystring, pry should be database specific later
  if (server && !userCreds.region) {
    userCreds.region = server;
  }

  const buckets = S3LsBuckets(AwsKeys.S3(userCreds)).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FETCHING_AWS_BUCKETS', _err);
  });

  reply.code(httpCodes.OK);
  return buckets;
};
