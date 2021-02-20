import { createEndpoint, squareupExecute } from './squareup.api';

export const getPayment = (sqToken: any, location: string, id: string) => {
  const endpoint = 'payments/' + encodeURIComponent(id);
  return squareupExecute(sqToken, createEndpoint(endpoint, location, 'v2', sqToken), 'GET');
};

export const getPayments = (sqToken: any, querystring: any) => {
  let endpoint = 'payments?';
  const arrKeys = Object.keys(querystring);
  const arrKeysLen = arrKeys.length;
  for (let i = 0; i < arrKeysLen; i++) {
    endpoint += '&' + encodeURIComponent(arrKeys[i]) + '=' + encodeURIComponent(querystring[arrKeys[i]]);
  }
  return squareupExecute(sqToken, createEndpoint(endpoint, null, 'v2', sqToken), 'GET');
};

export const getPaymentsNext = (sqToken: any, nextUrl: string): Promise<any> => squareupExecute(sqToken, nextUrl, 'GET');

export const getWebhookPaymentInfo = (body: any = {}) => {

};
