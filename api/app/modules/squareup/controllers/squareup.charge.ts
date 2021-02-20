import { config } from '@lib/config';
import { insert, query } from '@lib/db';
import { SquareupV2 } from '@typings/index';
import { PoolConnection, RowDataPacket } from 'mysql2';

import { createEndpoint, getSquareupToken, squareupExecute } from './squareup.api';
import { findLocationCapability, getLocations } from './squareup';

export const runCharge = (charge: SquareupV2.ISquareupCharge, sandbox = null): Promise<SquareupV2.ISquareupChargeResponse> => {
  const capabilityNeeded = 'CREDIT_CARD_PROCESSING';
  const sqToken: any = getSquareupToken(sandbox);

  return getLocations(sqToken). // Fetch Capatible locations
    then(l => {
      const lData = l.data || {},
            lList = lData.locations || [];

      if (!lList || !lList.length) {
        return Promise.reject({ status: 400, errors: [{ detail: `No locations available.` }] });
      }
      return findLocationCapability(lList, capabilityNeeded);
    }). // Found Locaton, Insert idempotency key payment record
    then(async (location: SquareupV2.ISquareupLocation | null) => { // Setup Charge
      if (!location) {
        return Promise.reject({ status: 400, errors: [{ detail: `No locations have ${capabilityNeeded} capabilities.` }] });
      }
      return insert(
        {
          token: charge.idempotency_key,
          amount: ((charge.amount_money || {}).amount || -1),
          status: 0,
          charge: JSON.stringify(charge),
          transaction: ''
        },
        config.squareup.dbTables.sqCharges
      ).then(() => location);

    }). // Execute charge to location
    then((location: SquareupV2.ISquareupLocation | null) =>
      squareupExecute(sqToken, createEndpoint('transactions', (location || {}).id, 'v2', sqToken), 'POST', JSON.stringify(charge))
    ).
    then((resp: any) =>
      insert(
        {
          token: charge.idempotency_key,
          amount: ((charge.amount_money || {}).amount || -1),
          status: resp.status,
          charge: JSON.stringify(charge),
          transaction: JSON.stringify(resp)
        },
        config.squareup.dbTables.sqCharges
      ).then(() => resp)
    );
};

export const getCharges = (chargeToken: string, db?: PoolConnection): Promise<RowDataPacket[]> =>
  query<RowDataPacket[]>(
    'SELECT ??, ??, ??, ??, ?? FROM ?? WHERE ?? LIKE ? ORDER BY ?? DESC',
    ['token', 'amount', 'status', 'transaction', 'datestamp', config.squareup.dbTables.sqCharges, 'token', chargeToken + '-%', 'id'],
    db
  ).
    then((results: any[]) =>
      results.map((result: any) => {
        try {
          result.transaction = JSON.parse(result.transaction) || result.transaction;
          if (result.transaction.hasOwnProperty('data') && result.transaction.data !== null &&
            result.transaction.data.hasOwnProperty('transaction') && result.transaction.data.transaction !== null
          ) {
            result.transaction = result.transaction.data.transaction;
          }
        } catch (e) { }
        return result;
      })
    );
