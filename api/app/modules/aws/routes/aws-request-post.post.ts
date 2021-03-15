import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';
import { join as pathJoin } from 'path';

import * as AwsKeys from '../controllers/aws.keys';
import { saveVideoUploadData } from '../controllers/aws.file-info';
import { createSignedPostUrl } from '../controllers/aws.cmd-urls';
import { getAWSPostCreds } from '../controllers/aws.cmd-keys';

export const awsRequestPostPost: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {
  const role = request.rbac.getRole(request.user);
  // const role = (((request.user || {}).role || []).find(r => r.area === '') || config.rbac.defaultRole || { role: ''}).role;
  if (!await request.rbac.can(role, 'video:url-sign')) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }

  const params: any = request.params || {},
        eventSlug = params.event_id || 'unknown',
        body: any = request.body || {},
        filename = body.filename || '',
        content = body.content || 'video/*',
        info = body.info || {};

  let prefix = body.prefix || '';

  if (!filename || filename === '') {
    throw request.generateError(httpCodes.NOT_FOUND, 'ERROR_NO_FILENAME');
  }

  const userCreds = await getAWSPostCreds((request.user || {}).id).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FINDING_USER', _err);
  });

  const homeDir = pathJoin('comps/', eventSlug + '/');
  if (prefix.indexOf(homeDir) === 0) {
    prefix = prefix.substr(homeDir.length);
  } else {
    prefix = '';
  }

  saveVideoUploadData(homeDir + prefix, filename, info).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FINDING_USER', _err);
  });

  const postUrl = createSignedPostUrl(
    AwsKeys.S3(userCreds),
    'sdob-user-upload',
    homeDir + prefix + filename,
    content,
    1200
  ).catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_CREATING_URL', _err);
  });

  reply.code(httpCodes.OK);
  return postUrl;
};
