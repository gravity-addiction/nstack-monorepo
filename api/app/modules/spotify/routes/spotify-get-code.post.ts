import httpCodes from '@inip/http-codes';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { spotifyGenerateShortId } from '../controllers/spotify';

export const spotifyGetCodePost: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {

  const body: any = request.body || {},
  serialNum = body.s || '',
  modelNum = body.m || '',
  revisionNum = body.r || '';

  const shortCode = await spotifyGenerateShortId(serialNum, modelNum, revisionNum).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_CREATING_CODE', _err);
  });

  reply.code(httpCodes.CREATED);
  return shortCode;
};

export const spotifyGetCodePostSchema = {
  response: {
    201: {
      type: 'object',
      properties: {
        s: { type: 'string' }, // Serial Number
        m: { type: 'string' }, // Model
        r: { type: 'string' }, // Model Revision
      },
    },
  },
};
