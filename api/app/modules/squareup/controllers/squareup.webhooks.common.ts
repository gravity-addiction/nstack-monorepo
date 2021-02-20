import httpCodes from '@inip/http-codes';
import { config } from '@lib/config';
import { enc, HmacSHA1 } from 'crypto-js';

import { createPaymentUpserts, getPayment } from './squareup.payments.v1';
import { getSquareupToken } from './squareup.api';

export const checkWebhookAuth = (body: any, secret: string, sandbox: boolean = false) => {
  const sqToken: any = getSquareupToken(sandbox);
  const hmac = HmacSHA1(
    (sqToken || {}).webhookUrl + JSON.stringify(body || {}), ((sqToken || {}).webhookValidationSalt || '')
  );
  // console.log('shouldbe', enc.Base64.stringify(hmac));
  return (enc.Base64.stringify(hmac) === secret);
};

export const getWebhookPortalIdent = (body: any = {}): { service: string; ident: string } =>
  ({ service: 'squareup', ident: body.merchant_id || body.location_id || body.creator_id || '' });

// Middleware method to grab required information to create upsert records
export const middlewareCreatePaymentUpserts = async (sqToken: any, dbName: string, locationId: string, paymentId: string) => {
  // Grab v1 Payment layout for processing
  const paymentInfo: any = await getPayment(sqToken, locationId, paymentId).catch((err: any) => {
    console.log('Could not grab payment info, Payment:', paymentId, 'Location:', locationId);
    return Promise.reject(err);
  });
  if (paymentInfo.status === httpCodes.OK) {
    // console.log('Got V1 Payment', paymentInfo);
    const paymentData = await createPaymentUpserts(paymentInfo.data || {}, dbName);
    return Promise.resolve(paymentData);
  }

  console.log('Payment query status:', paymentInfo.status);
  console.log(paymentInfo);
  return Promise.reject(paymentInfo);
};
