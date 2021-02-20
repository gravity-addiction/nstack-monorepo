import httpCodes from '@inip/http-codes';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { spotifyAccessTokenFetch, spotifyAccessTokenSave } from '../controllers/spotify';

export const spotifyValidateCodeGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {
  const query: any = request.query || {},
        code = query.code || '',
        state = query.state || '';


  if (!code || !state) {
    reply.redirect(httpCodes.SEE_OTHER, 'https://spotify.skydiveorbust.com/failed.html');
    return;
  }


  // Exchange Auth Code for Access and Refresh Tokens
  const tokenInfo = await spotifyAccessTokenFetch(code).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_VALIDATING_TOKEN', _err);
  });

  if (tokenInfo.status < 200 || tokenInfo.status >= 300) {
    const uErr = ((tokenInfo.data || {}).data || {}).error_description || ((tokenInfo.data || {}).data || {}).error || '';
    reply.redirect(httpCodes.SEE_OTHER, 'https://spotify.skydiveorbust.com/failed.html?' +
        'status=' + encodeURIComponent(tokenInfo.status) +
        '&err=' + encodeURIComponent(uErr)
    );
    return;
  }

  reply.redirect(httpCodes.SEE_OTHER, 'https://spotify.skydiveorbust.com/confirm.html');

  // Save Tokens
  await spotifyAccessTokenSave(state, tokenInfo.data);

  // Fetch More Information
};
