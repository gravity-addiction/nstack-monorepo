import httpCodes from '@inip/http-codes';
import { RecordsByStateParams } from '@typings/records';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getRecordsByState } from '../controllers/records';

export const recordsStateGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {

  const params: RecordsByStateParams = request.params as RecordsByStateParams || {} as RecordsByStateParams,
        abbr = params.abbr || '';

  const record = await getRecordsByState(abbr).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FINDING_RECORDS_STATE', _err);
  });

  reply.code(httpCodes.OK);
  return record;
};

export const recordsStateGetSchema = {
  response: {
    200: {
      type: 'array',
      items: {
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
  },
};
