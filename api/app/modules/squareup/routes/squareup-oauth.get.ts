import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getSquareupToken } from '../controllers/squareup.api';
import { saveOAuthToken, squareupOAuth } from '../controllers/squareup.oauth';

export const squareupOauthGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {

  const query: any = request.query || {},
        queryCode = query.code || '';

  const sqToken: any = getSquareupToken(config.squareup.useSandbox);
  const requestToken: any = squareupOAuth(queryCode, sqToken, ).catch((err: any) => {
    // console.log('Got Errors', err);
    throw request.generateError(500, err.message, err);
  });


  const resultStatus = requestToken.status || httpCodes.INTERNAL_SERVER_ERROR,
        resultData = requestToken.data || {};


  if (resultStatus === httpCodes.OK || resultStatus === httpCodes.CREATED) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    await saveOAuthToken(Object.assign(resultData, {app_id: sqToken.appId})).catch((err: any) => {
      // console.log('Got Errors', err);
      throw request.generateError(500, err.message, err);
    });
    reply.redirect(302, (config.squareup || {}).redirectUri || 'https://vendorportal.org/');
    return;
  }

  throw request.generateError(requestToken.status, requestToken.error || 'Didn\'t work out for you.');
};
