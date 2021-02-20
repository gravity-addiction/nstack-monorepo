import { config } from '@lib/config';

import { getSquareupToken } from './squareup.api';
import { getOAuthToken } from './squareup.oauth';
import { middlewareCreatePaymentUpserts } from './squareup.webhooks.common';

export const addWebhook = (sqToken: any, location: string): Promise<any> =>
  Promise.reject('Webhooks in v2 are global for the account');


export const removeWebhook = (sqToken: any, location: string): Promise<any> =>
  Promise.reject('Webhooks in v2 are global for the account');


// processing webhooks from squareup v2 events based
export const processWebhook = async (body: any = {}, dbName: string, sqToken: any = null) => {
  const merchantId = body.merchant_id || '',
        webhookType = body.type || '',
        webhookData = body.data || {},
        webhookDataType = webhookData.type || '',
        webhookDataObj = webhookData.object || {},
        webhookPayload = webhookDataObj[webhookDataType] || {};


  if (!sqToken) {
    sqToken = getSquareupToken(config.squareup.useSandbox);
    const merchantToken: string = await getOAuthToken(merchantId);
    // console.log(merchantId, merchantToken);
    sqToken = Object.assign({}, sqToken, { accessToken: merchantToken });
  }

  console.log('Event:', webhookType);
  console.log(JSON.stringify(webhookPayload));
  // Processing payment object type
  if (webhookDataType === 'payment') {
    const locationId = webhookPayload.location_id || '',
          orderId = webhookPayload.order_id || '',
          paymentId = webhookPayload.id || '';

    return new Promise(res => setTimeout(
      () => {
        res(middlewareCreatePaymentUpserts(sqToken, dbName, locationId, paymentId));
      },
      (webhookType === 'payment.created') ?
          ((config.squareup || {}).paymentWebhookCreatedLookupDelay || 2000) :
          ((config.squareup || {}).paymentWebhookLookupDelay || 500)
    ));

  } else if (webhookDataType === 'refund') {
    const locationId = webhookPayload.location_id || '',
          orderId = webhookPayload.order_id || '',
          paymentId = webhookPayload.payment_id || '';

    return new Promise(res => setTimeout(
      () => {
        res(middlewareCreatePaymentUpserts(sqToken, dbName, locationId, paymentId));
      },
      (webhookType === 'refund.created') ?
          ((config.squareup || {}).refundWebhookCreatedLookupDelay || 2000) :
          ((config.squareup || {}).refundWebhookLookupDelay || 500)
    ));
  }

  console.log('Unknown webhook type:', webhookDataType);
  console.log('Processing Dud', webhookType, body);
  console.log(JSON.stringify(body));
  return Promise.reject(body);
};
