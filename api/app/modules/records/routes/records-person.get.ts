import httpCodes from '@inip/http-codes';
import { RecordParams, ResultsRecordUSPA } from '@typings/records';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getRecordsByPerson } from '../controllers/records';

export const recordsPersonGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<ResultsRecordUSPA[]> => {

  const params: RecordParams = request.params as RecordParams || {} as RecordParams,
        id = parseInt(params.id, 10) || 0;

  const records = await getRecordsByPerson(id).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FINDING_RECORDS_BY_PERSON', _err);
  });

  reply.code(httpCodes.OK);
  return records;
};

export const recordsPersonGetSchema = {
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
