import httpCodes from '@inip/http-codes';
import { defaultUpperAlphaNumeric, generateRandomString } from '@lib/fisher-yates-shuffle';
import { SquareupV2 } from '@typings/index';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';
import { RowDataPacket } from 'mysql2';

import { getInvoiceByPayId } from '../controllers/invoices';
import { getCharges, runCharge } from '../../squareup/controllers/squareup';

export const invoicesPayByIdPost: RouteHandlerMethod = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<any> => {

  const body: any = request.body || {},
        params: any = request.params || {},
        payid = params.pay_id,

        nonce = body.nonce || '',
        payidBody = body.payid || '',
        amount = body.amount || 0,
        floatAmount = parseFloat(amount) || 0;

  let squareIdempotency = body.idempotency;

  if (!nonce) {
    throw request.generateError(httpCodes.BAD_REQUEST, 'There was a problem with the square up processing, You have Not been charged.');
  }
  if (!payid || payidBody !== payid) {
    throw request.generateError(httpCodes.BAD_REQUEST, 'There was a problem with the payment id, You have Not been charged.');
  }

  const invoiceData = await getInvoiceByPayId(payid).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'Error Looking up Invoice', _err);
  });
  const invoicePayments = await getCharges(payid).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'Error Looking up Invoice', _err);
  });

  let tenderTotal = 0;
  if (invoicePayments && invoicePayments.length) {
    // Check Amounts and Status
    const pLen = invoicePayments.length;
    for (let p = 0; p < pLen; p++) {
      const pInfo: any = invoicePayments[p] || {};
      if (pInfo.status === 200 || pInfo.status === 201) {
        tenderTotal += pInfo.amount;
      }
    }
  }

// console.log('Payments', invoicePayments);
// console.log('Tender', tenderTotal);

  const invoiceAmount = parseFloat(invoiceData.invoice_total) || 0,
        squareAmount = Math.round(floatAmount * 100),
        invoiceRemain = Math.round(Math.round(invoiceAmount * 100) - tenderTotal) / 100;

  if (invoiceRemain !== floatAmount || !squareAmount) {
    reply.code(httpCodes.CONFLICT);
    return {
      amount: invoiceRemain,
      // eslint-disable-next-line max-len
      detail: `There was a problem with the submitted amount of: $${floatAmount} .. Our calculations feel the amount should be $${invoiceRemain}

You have not been charged. Please contact, gary@strictdevelopment.com`
    };
  }

  let chargeRequest: SquareupV2.ISquareupCharge;

  // Find Previous Transaction
  const pastCharges = await getCharges(payid).
  catch((_err: Error) => {
    throw request.generateError(httpCodes.INTERNAL_SERVER_ERROR, 'Error Looking up Prior Charges', _err);
  });

  // Dupliate Idempotency?
  let pastIndex = -1;
  if (pastCharges.length && squareIdempotency) {
    pastIndex = pastCharges.findIndex((charge: RowDataPacket) => charge.token === (payid || '').toString() + '-' + squareIdempotency);
  }

  if (pastIndex > -1) {
    // Reset Charge to previous request
    chargeRequest = JSON.parse(pastCharges[pastIndex].charge) as SquareupV2.ISquareupCharge;
  } else {
    squareIdempotency = generateRandomString(4, defaultUpperAlphaNumeric);

    // Test new Idempt
    let testIndex = 0, testCnt = 0;
    while (testIndex > -1 && testCnt > 100) {
      testIndex = (pastCharges.length) ?
          pastCharges.findIndex((charge: RowDataPacket) => charge.token === (payid || '').toString() + '-' + squareIdempotency) :
          -1;
      testCnt += 1;
      squareIdempotency = generateRandomString(4, defaultUpperAlphaNumeric);
    }

    /* eslint-disable @typescript-eslint/naming-convention */
    chargeRequest = {
      card_nonce: nonce,
      amount_money: {
        amount: squareAmount,
        currency: 'USD'
      },
      reference_id: (payid || '').toString(),
      idempotency_key: (payid || '').toString() + '-' + squareIdempotency
    };
  }

  const chargeResp: any = await runCharge(chargeRequest).
  catch(err => {
    // console.log('Got Errors', err);
    throw request.generateError(err.status, err.message, err);
  });

  // console.log('Done', chargeResp);
  reply.code(httpCodes.CREATED);
  return {
    token: chargeRequest.idempotency_key,
    amount: squareAmount,
    transaction: (chargeResp.data || {}).transaction || {},
    status: chargeResp.status || 500,
    errors: (chargeResp.data || {}).errors || []
  };
};
