import httpCodes from '@inip/http-codes';
import { RecordParams } from '@typings/records';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getRecordsById } from '../controllers/records';

export const recordsIdGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {

  const params: RecordParams = request.params as RecordParams || {} as RecordParams,
        id = parseInt(params.id, 10) || 0;

  const record = await getRecordsById(id).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FINDING_RECORDS_ID', _err);
  });

  reply.code(httpCodes.OK);
  return record;
};

export const recordIdGetSchema = {
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        zone: { type: 'string' },
        state: { type: 'string' },
        subclass: { type: 'string' },
        category: { type: 'string' },
        record: { type: 'string' },
        performance: { type: 'string' },
        recordno: { type: 'string' },
        uspaclass: { type: 'string' },
        uspadate: { type: 'string' },
        location: { type: 'string' },
        holders: { type: 'string' },
        notes: { type: 'string' },
        status: { type: 'string' },
      },
    },
  },
};
