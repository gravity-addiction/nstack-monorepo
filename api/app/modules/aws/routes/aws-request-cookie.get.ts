import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import * as AwsKeys from '../controllers/aws.keys';
import { createSignedUrlS3, createSignedCookie } from '../controllers/aws.cmd-urls';
import { getAWSRequestCreds } from '../controllers/aws.cmd-keys';
import { lsFolder } from '../controllers/aws.cmd-s3';

export const awsRequestCookieGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> => {

  if (!await request.rbac.can((request.user || {}).role || '', 'video:url-sign')) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }


  const query: any = request.query || {},
        rootPath = query.root || '',
        key = query.key || '',
        bucket = query.bucket || '',
        server = query.server || '';

  if (!rootPath || rootPath === '') {
    throw request.generateError(httpCodes.NOT_FOUND, 'ERROR_NO_ROOT');
  }

  let urlQuery;
  if (bucket === 'sdob-videos') {
    const userCreds = await getAWSRequestCreds((request.user || {}).id).
    catch((_err: Error) => {
      throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FETCHING_AWS_LS', _err);
    });

    await lsFolder(AwsKeys.S3(userCreds), bucket, key).
    catch((_err: Error) => {
      throw request.generateError(httpCodes.UNAUTHORIZED);
    });

    urlQuery = createSignedCookie(
      config.aws.signingParams,
      rootPath,
      30
    );

  } else if (bucket && server && request.user) {
    const userCreds = await getAWSRequestCreds((request.user || {}).id).
    catch((_err: Error) => {
      throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FINDING_USER', _err);
    });

    // Set blank region by querystring, pry should be database specific later
    if (server && !userCreds.region) {
      userCreds.region = server;
    }
    urlQuery = await createSignedUrlS3(AwsKeys.S3(userCreds), bucket, key, 1200).
    catch((_err: Error) => {
      throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_SIGNING_URL', _err);
    });
  } else {
    throw request.generateError(httpCodes.BAD_REQUEST, 'ERROR_INVALID_SERVER_BUCKET');
  }

  // You can now set cookies in your response header. For example:
  // console.log(urlQuery);
  const resKeys = Object.keys(urlQuery);
  const resLen = resKeys.length || 0;
  for (let i = 0; i < resLen; i++) {
    const cookieId = resKeys[i];
    reply.setCookie(cookieId, urlQuery[cookieId], {
      domain: '.skydiveorbust.com',
      path: ((rootPath === '*') ? '/' : rootPath),
      secure: true,
    });
  }

  reply.code(httpCodes.NO_CONTENT);
  return;
};
