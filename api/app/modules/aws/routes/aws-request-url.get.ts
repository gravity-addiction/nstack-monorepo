import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import * as AwsKeys from '../controllers/aws.keys';
import { createSignedUrlCloudFront, createSignedUrlS3 } from '../controllers/aws.cmd-urls';
import { getAWSRequestCreds } from '../controllers/aws.cmd-keys';

export const awsRequestUrlGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {
  // if (!await request.rbac.can((request.user || {}).role || '', 'video:url-sign')) {
  //   throw request.generateError(httpCodes.UNAUTHORIZED);
  // }

  const query: any = request.query || {},
        key = query.key || '',
        bucket = query.bucket || '',
        server = query.server || '';

  if (!key || key === '') {
    throw request.generateError(httpCodes.NOT_FOUND, 'ERROR_NO_KEY');
  }

  let signUrl, urlQuery;
  // Cloudfront Signed Url
  if (bucket === 'sdob-videos') {
    signUrl = 'https://sdob-1.cloudfront.skydiveorbust.com/';
    urlQuery = createSignedUrlCloudFront(
      config.aws.signingParams,
      signUrl + key,
      8
    );

  // S3 Signed URL
  } else { // if (request.user) {
    const userCreds = await getAWSRequestCreds((request.user || {}).id).
    catch((_err: Error) => {
      throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FINDING_USER', _err);
    });

    // Set blank region by querystring, pry should be database specific later
    if (server && !userCreds.region) {
      userCreds.region = server;
    }
    urlQuery = await createSignedUrlS3(AwsKeys.S3(userCreds), bucket, key, 1200);
  }//  else {
  //  throw request.generateError(httpCodes.NOT_FOUND, 'ERROR_INVALID_BUCKET');
  // }

  reply.code(httpCodes.OK);
  return urlQuery;
};
