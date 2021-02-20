import httpCodes from '@inip/http-codes';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

import { getInvoiceByPayId, getInvoiceItems, getInvoicePayments } from '../controllers/invoices';
import { getCharges } from '../../squareup/controllers/squareup';

export const invoicesByPayIdGet: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {

  const params: any = request.params,
        payid = params.pay_id || 0;

  if (!payid) {
    throw request.generateError(httpCodes.BAD_REQUEST, 'No Payment Id');
  }

  const retInvoice = await getInvoiceByPayId(payid).
    catch((_err: Error) => {
      throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'Error Looking up Invoice', _err);
    });
  retInvoice.items = await getInvoiceItems(retInvoice.id).
    catch((_err: Error) => {
      throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'Error Looking up Invoice Items', _err);
    });
  retInvoice.payments = await getInvoicePayments(retInvoice.id).
    catch((_err: Error) => {
      throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'Error Looking up Prior Payments', _err);
    });

  retInvoice.charges = await getCharges(payid).
    catch((_err: Error) => {
      throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'Error Looking up Prior Charges', _err);
    });

  reply.code(httpCodes.OK);
  return retInvoice;
};
