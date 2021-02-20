import { commit, upsert, connection, beginTransaction, rollback } from '@lib/db';
import { PoolConnection } from 'mysql2';
import { createEndpoint, squareupExecute } from './squareup.api';

export const getPayment = (sqToken: any, location: string, id: string): Promise<any> => {
  const endpoint = 'payments/' + encodeURIComponent(id);
  // console.log('Going To Endpoint', createEndpoint(endpoint, location, 'v1', sqToken));
  return squareupExecute(sqToken, createEndpoint(endpoint, location, 'v1', sqToken), 'GET');
};

export const getPayments = (sqToken: any, location: string, begin: string, end: string): Promise<any> => {
  let endpoint = 'payments?limit=100';
  if (begin) {
    endpoint += '&begin_time=' + encodeURIComponent(begin);
  }
  if (end) {
    endpoint += '&end_time=' + encodeURIComponent(end);
  }
  // console.log('Getting', location, endpoint);
  return squareupExecute(sqToken, createEndpoint(endpoint, location, 'v1', sqToken), 'GET');
};

export const getPaymentsNext = (sqToken: any, nextUrl: string): Promise<any> => squareupExecute(sqToken, nextUrl, 'GET');

export const getWebhookPaymentInfo = (body: any = {}) => {

};

export const createPaymentUpserts = async (d: any, dbName: string) => {
  // console.log('Payment Upserts', d);
  const dCreated = new Date(d.created_at);
  const createdAt = dCreated.getFullYear() + '-' +
                    (dCreated.getMonth() + 1) + '-' +
                    dCreated.getDate() + ' ' +
                    dCreated.getHours() + ':' +
                    dCreated.getMinutes() + ':' +
                    dCreated.getSeconds();

  const creditCard: any[] = [],
        pFee = d.processing_fee_money || {},
        tNet = d.net_sales_money || {},
        total = tNet.amount || 0,
        ccAmt = pFee.amount || 0,
        items = d.itemizations || [];

  items.forEach((i: any, ind: number) => {
    const iNet = i.net_sales_money.amount || 0;
    const ccTotal = Math.round((iNet / total) * ccAmt);
    creditCard[ind] = Math.abs(ccTotal) / 100;
  });

  // console.log('Saving To', dbName);
  // Grab DB Connection for this Transaction
  const db: PoolConnection = await connection();
  await beginTransaction(db); // Begin Transactional Query

  /* eslint-disable @typescript-eslint/naming-convention */
  const squareupData = {
    id: d.id,
    creator_id: (d.creator_id || d.merchant_id),
    location_id: d.merchant_id,
    created_at: createdAt,
    json: JSON.stringify(d)
  };

  // Main Upsert
  d.upsert = await upsert(squareupData, `${dbName}.squareup`, [], db).
  catch(async (err) => { // rollback from any problems
    console.log('Rollback!', err);
    await rollback(db);
    db.release();
    return Promise.reject(err);
  });

  const sql = 'SELECT `commission` FROM ?? WHERE ?? IN (SELECT ?? FROM ?? WHERE ?? = ? AND ?? = ? AND ?? = ?)';
  const dItems = d.itemizations || [],
        dLen = dItems.length;

  for (let dI = 0; dI < dLen; dI++) {
    const i = dItems[dI] || {};
    const squareupItemData = {
      id: d.id + '-' + dI,
      payment_id: d.id,
      vendor_id: i.name,
      commission: { sql: db.format(sql, [
        `${dbName}.vendors`,
        `${dbName}.vendors.id`,
        `${dbName}.vendors_active.vendors_id`,
        `${dbName}.vendors_active`,
        `${dbName}.vendors_active.vendor_id`, i.name,
        `${dbName}.vendors_active.mon`, (dCreated.getMonth() + 1),
        `${dbName}.vendors_active.yr`, dCreated.getFullYear()
      ]) },
      creditcard: ((!isNaN(creditCard[dI]) && creditCard[dI]) ? creditCard[dI] : 0),
      json: JSON.stringify(i)
    };

    // upsert item, filter out commission rate for updates, want commission staying the same as realtime
    i.upsert = await upsert(squareupItemData, `${dbName}.squareup_items`, ['commission'], db).
    catch(async (err) => { // rollback from problems
      console.log('Item Rollback!', err);
      await rollback(db);
      db.release();
      return Promise.reject(err);
    });
  }

  // Commit and Release db connection
  await commit(db);
  db.release();
  return d; // inserts;
};
