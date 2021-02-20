import { config } from '@lib/config';

import { createEndpoint, getSquareupToken, squareupExecute } from './squareup.api';
import { getOAuthToken } from './squareup.oauth';
import { middlewareCreatePaymentUpserts } from './squareup.webhooks.common';

export const addWebhook = (sqToken: any, location: string): Promise<any> =>
  squareupExecute(sqToken, createEndpoint('webhooks', location, 'v1', sqToken), 'PUT', JSON.stringify(['PAYMENT_UPDATED']));

export const removeWebhook = (sqToken: any, location: string): Promise<any> =>
  squareupExecute(sqToken, createEndpoint('webhooks', location, 'v1', sqToken), 'PUT', JSON.stringify([]));

export const processWebhook = async (body: any = {}, dbName: string, sqToken: any = null) => {
  const merchantId = body.merchant_id || body.location_id || '',
        locationId = body.location_id || '',
        paymentId = body.entity_id || '';

  if (!sqToken) {
    sqToken = getSquareupToken(config.squareup.useSandbox);
    const merchantToken: string = await getOAuthToken(merchantId);
    // console.log(merchantId, merchantToken);
    sqToken = Object.assign({}, sqToken, { accessToken: merchantToken });
  }

  return await middlewareCreatePaymentUpserts(sqToken, dbName, locationId, paymentId);
};
