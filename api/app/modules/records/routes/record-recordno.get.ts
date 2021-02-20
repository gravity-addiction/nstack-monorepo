import httpCodes from '@inip/http-codes';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getRecordsByRecordno } from '../controllers/records';

export const recordsRecordnoGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {

  const query: any = request.query || {},
        id = query.rno || [];

  const record = await getRecordsByRecordno(id).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'ERROR_FINDING_RECORDS_ID', _err);
  });

  reply.code(httpCodes.OK);
  return record;
};
