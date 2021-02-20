import httpCodes from '@inip/http-codes';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { rpiGenerateShortId } from '../controllers/rpi';

export const rpiGetCodePost: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {

  const body: any = request.body || {};

  body.ip = request.headers['x-forwarded-for'] || request.ip || '';

  const shortCode = await rpiGenerateShortId(body).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_CREATING_CODE', _err);
  });

  reply.code(httpCodes.CREATED);
  return shortCode;
};

export const rpiGetCodePostSchema = {
  request: {
    type: 'object',
    properties: {
      s: { type: 'string' }, // Serial Number
      m: { type: 'string' }, // Model
      r: { type: 'string' }, // Model Revision
      e4: { type: 'string' }, // eth0 IPv4
      e6: { type: 'string' }, // eth0 IPv6
      w4: { type: 'string' }, // wlan0 IPv4
      w6: { type: 'string' }, // wlan0 IPv6
    },
  },
  response: {
    201: {
      type: 'string',
    },
  },
};
