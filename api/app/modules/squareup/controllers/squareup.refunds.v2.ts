import { createEndpoint, squareupExecute } from './squareup.api';

export const getRefund = (sqToken: any, id: string) => {
  const endpoint = 'refunds/' + encodeURIComponent(id);
  return squareupExecute(sqToken, createEndpoint(endpoint, null, 'v2', sqToken), 'GET');
};

export const getRefunds = (sqToken: any, querystring: any) => {
  let endpoint = 'refunds?';
  const arrKeys = Object.keys(querystring);
  const arrKeysLen = arrKeys.length;
  for (let i = 0; i < arrKeysLen; i++) {
    endpoint += '&' + encodeURIComponent(arrKeys[i]) + '=' + encodeURIComponent(querystring[arrKeys[i]]);
  }
  return squareupExecute(sqToken, createEndpoint(endpoint, null, 'v2', sqToken), 'GET');
};

export const getRefundsNext = (sqToken: any, nextUrl: string): Promise<any> => squareupExecute(sqToken, nextUrl, 'GET');

export const processSquareupRefund = (refund: any, portalInfo: any, sqToken: any = null) => {

};
