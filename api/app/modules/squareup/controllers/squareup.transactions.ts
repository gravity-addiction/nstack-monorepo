import { config } from '@lib/config';
import { dateMath } from '@lib/date-math';
import { first, query } from '@lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

import { addWebhook as squareupv1_addWebhook } from './squareup.webhooks.v1';

export * from './squareup.api';
export * from './squareup.commish';
export * from '../../item-review';

export const getSquareupTransactions = (
    vendorId: number | null, storeId: string | null,
    dNow: Date | null, dTill: Date | null,
    orderBy?: string | null
) => {
  return getSquareup(null, vendorId, storeId, dNow, dTill, orderBy);
};

export const getSquareup = (
    paymentId: string | null, vendorId: number | null, locationId: string | null,
    dStart: Date | null = new Date(new Date().setHours(0, 0, 0)), dTill: Date | null = new Date(new Date().setHours(23, 59, 59)),
    orderBy: string | null = 'ASC'
) => {

  return getPayments(paymentId, vendorId, locationId, dStart, dTill, orderBy).
          then((payments: RowDataPacket[]) => {
            return (payments || []).map((p: any) => p.json = paymentsFixup(itemRemap(p)));
          });
};

export const paymentsFixup = (r: any) => {
  const netSalesMoney = r.net_sales_money || {},
        netSalesAmt = netSalesMoney.amount || 0,
        taxMoney = r.tax_money || {};
  let taxAmt = taxMoney.amount || 0;
  let originalAmt = netSalesAmt;

  const refunds: any[] = [];
  if (r.refunds) {
    r.refunds.forEach((refund: any) => {
      delete refund.merchant_id;
      delete refund.payment_id;

      const refunded = refund.refunded_money || {},
            refundedDiscount = refund.refunded_discount_money || {},
            refundedTax = refund.refunded_additive_tax_money || {},
            refundedCreditcard = refund.refunded_processing_fee_money || {};

      refund.total_money = refunded.amount || 0;
      refund.discount_money = refundedDiscount.amount || 0;
      refund.tax_money = refundedTax.amount || 0;
      refund.creditcard = refundedCreditcard.amount || 0;

      delete refund.refunded_money;
      delete refund.refunded_discount_money;
      delete refund.refunded_additive_tax_money;
      delete refund.refunded_processing_fee_money;

      refunds.push(refund);
    });
  }

  const commissionAmt = Math.round(netSalesAmt * (r.commission / 100));

  if (r.taxes && r.taxes.length) {
    r.taxes.forEach((t: any) => {
      const appliedMoney = t.applied_money || {},
            taxAmount = appliedMoney.amount || 0;
      taxAmt += taxAmount;
    });
  }


  if (r.discounts && r.discounts.length) {
    r.discounts.forEach((d: any) => {
      const appliedMoney = d.applied_money || {},
            discountAmount = appliedMoney.amount || 0;
      originalAmt += Math.round(discountAmount * -1);
    });
  }

  if (r.modifiers && r.modifiers.length) {
    r.modifiers.forEach((m: any) => {
      const appliedMoney = r.applied_money || {},
            modifierAmount = appliedMoney.amount || 0;
      originalAmt += Math.round(modifierAmount * -1);
    });
  }

  const dataSet: any = {
    id: r.id,
    vendor_orig: r.vendor_orig,
    vendor_id: r.vendor_id,
    vendors_id: r.vendors_id,
    created_at: r.created_at,
    quantity: r.quantity,
    notes_orig: r.notes_orig,
    notes: r.notes,
    net_sales_money: (netSalesAmt / 100),
    tax_money: (taxAmt / 100) || 0,
    commission_orig: r.commission_orig || 0,
    commission: r.commission,
    commission_money: (commissionAmt / 100) || 0,
    creditcard: r.creditcard || 0,
    payout: (Math.round(netSalesAmt - (r.creditcard * 100) - commissionAmt) / 100),
    original: (originalAmt / 100),
    issues_resolved: (r.issues_resolved) ? r.issues_resolved.split('\n') : [],
    issues: (r.issues) ? r.issues.split('\n') : [],
    discounts: r.discounts,
    modifiers: r.modifiers,
    refunds,
  };

  return dataSet;
};

export const itemRemap = (item: any) => {
  if (typeof item.json === 'string') {
    try { item.json = JSON.parse(item.json); } catch (e) { item.json = {}; }
  }

  item.json.id = item.id;
  item.json.created_at = item.created_at;
  item.json.vendors_id = item.vendors_id;
  item.json.vendor_orig = item.vendor_id;
  item.json.vendor_id = item.or_vendor_id || item.vendor_id;
  item.json.commission_orig = item.commission || 0;
  item.json.commission = item.or_commission || item.commission;
  item.json.creditcard = item.creditcard;
  item.json.notes_orig = item.json.notes;
  item.json.notes = item.or_notes || item.json.notes_orig;
  item.json.vendor = item.vendor;
  item.json.issues_resolved = item.issues_resolved;
  item.json.issues = item.issues;

  // const dataJSON = JSON.parse(item.orig);
  // console.log(item.orig);
  if (item.orig && item.orig.refunds) { item.json.refunds = item.orig.refunds; }

  return item.json;
};

export const addWebhook = (locationId: string) => {
  return getSquareupToken(locationId).then((key: any) => squareupv1_addWebhook(key.access_token, locationId));
};


const getPayments = (paymentId: string | null, vendorId: number | null, locationId: string | null,
                     dStart: Date | null, dTill: Date | null, orderBy: string | null): Promise<RowDataPacket[]> => {

/*
    console.log('CALL', config.squareup.dbSPs.procPayments, '(',
    paymentId, ',',
    vendorId, ',',
    `'${locationId}',`,
    `'${dateMath(dStart)}',`,
    `'${dateMath(dTill)}',`,
    `'${(orderBy || '').toLocaleUpperCase()}'`,
    ')');
*/

  return query<any>('CALL ??(?, ?, ?, ?, ?, ?)',
    [ config.squareup.dbSPs.procPayments,
      paymentId,
      vendorId,
      locationId,
      dateMath(dStart),
      dateMath(dTill),
      (orderBy || '').toLocaleUpperCase(),
    ]
  ).then((resp: [RowDataPacket[], ResultSetHeader]) => (resp[0] || []));
};

const getSquareupToken = (merchantId: string): Promise<RowDataPacket> => {
  return query<RowDataPacket[]>(
    'SELECT `access_token` FROM ?? WHERE merchant_id = ? ORDER BY `id` DESC',
    [config.squareup.dbTables.squareupOAuth, merchantId]
  ).then(resp => first(resp));
};


export const getSquareupItem = (itemId: string): Promise<RowDataPacket> => {
  return query<RowDataPacket[]>(
    'SELECT * FROM ?? WHERE id = ?',
    [config.squareup.dbTables.squareupItems, itemId]
  ).then(resp => first(resp));
};

export const getSquareupItemTransaction = (itemId: string): Promise<RowDataPacket> => {
  return query<RowDataPacket[]>(
    'SELECT ??, ??, ??, ??, ??, ??, ?? FROM ?? INNER JOIN ?? ON ?? = ?? WHERE ?? = ?',
    [
      config.squareup.dbTables.squareup + '.created_at',
      config.squareup.dbTables.squareup + '.location_id',
      config.squareup.dbTables.squareup + '.creator_id',
      config.squareup.dbTables.squareupItems + '.payment_id',
      config.squareup.dbTables.squareupItems + '.vendor_id',
      config.squareup.dbTables.squareupItems + '.commission',
      config.squareup.dbTables.squareupItems + '.creditcard',

      config.squareup.dbTables.squareup,
      config.squareup.dbTables.squareupItems,
      config.squareup.dbTables.squareup + '.id',
      config.squareup.dbTables.squareupItems + '.payment_id',

      config.squareup.dbTables.squareupItems + '.id',
      itemId,
    ]
  ).then(resp => first(resp));
};
