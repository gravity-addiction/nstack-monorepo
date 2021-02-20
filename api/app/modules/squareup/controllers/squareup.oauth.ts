import { config } from '@lib/config';
import { insert, first, query } from '@lib/db';
import { createOAuthEndpoint, getSquareupToken, squareupExecute } from './squareup.api';
import { PoolConnection, RowDataPacket } from 'mysql2';

export const squareupOAuth = (queryCode: string, sqToken: any = null, redirectUri?: string) => {
  /* eslint-disable @typescript-eslint/naming-convention */
  const postData = {
    client_id: (config.squareup || {}).appId || '',
    client_secret: (config.squareup || {}).accessToken || '',
    code: queryCode || '',
    redirect_uri: redirectUri || (config.squareup || {}).redirectUri || ''
  };

  return squareupExecute(sqToken, createOAuthEndpoint(sqToken), 'POST', postData);
};

export const saveOAuthToken = (token: any) => insert(token, config.auth.dbTables.oAuthTokens);

export const getOAuthToken = (merchantId: string, db?: PoolConnection): Promise<string> =>
  query<RowDataPacket[]>(
    'SELECT `access_token` FROM ?? WHERE `active` = 1 AND `merchant_id` = ANY(' +
    'SELECT `service_ident` FROM ?? WHERE `portals_id` = ANY(' +
    'SELECT `portals_id` FROM ?? WHERE `service_name` = ? AND `service_ident` = ? AND `active` = 1' +
    ')' +
    ') ORDER BY id DESC LIMIT 1',
    [config.auth.dbTables.oAuthTokens,
    config.government.dbTables.portalServices,
    config.government.dbTables.portalServices, 'squareup', merchantId
    ],
    db
  ).
    then(resp => first(resp)).
    then(resp => (resp.access_token || ''));
