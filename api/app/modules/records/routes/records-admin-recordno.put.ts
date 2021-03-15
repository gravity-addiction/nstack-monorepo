import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { putRecordByRecordno } from '../controllers/records';

export const recordsAdminRecordnoPut: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {

  const role = request.rbac.getRole(request.user);
  // const role = (((request.user || {}).role || []).find(r => r.area === '') || config.rbac.defaultRole || { role: ''}).role;
  if (!await request.rbac.can(role, 'records:update')) {
    throw request.generateError(httpCodes.UNAUTHORIZED);
  }

  const params: any = request.params || {},
        body: any = request.body || {},
        recordno = params.recordno || [];

  const record = await putRecordByRecordno(recordno, body).
  catch((_err: Error) => {
    console.log(_err); throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'Cannot update record', _err);
  });

  reply.code(httpCodes.OK);
  return record;
};
