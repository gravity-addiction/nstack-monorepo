import { config } from '@lib/config';
import { query } from '@lib/db';
import { PoolConnection, ResultSetHeader } from 'mysql2';

export const globalCommishUpdate = (db?: PoolConnection): Promise<ResultSetHeader> => {
  return query<ResultSetHeader>(`UPDATE ?? SET ?? = (
    SELECT ?? FROM ??
    WHERE ?? IN (
      SELECT ?? FROM ??
      WHERE ?? = ??
      AND ?? = (
        SELECT MONTH(??) FROM ??
        WHERE ?? = ??
        ORDER By ??
        LIMIT 1
      )
      AND ?? = (
        SELECT YEAR(??) FROM squareup
        WHERE squareup.order_id = squareup_items.order_id
        ORDER By created_at
        LIMIT 1
      )
    )
  )`, [
    config.squareup.dbTables.squareupItems,
    config.squareup.dbTables.squareupItems + '.commission',

    config.vendorPortal.dbTables.vendors + '.commission',
    config.vendorPortal.dbTables.vendors,
    config.vendorPortal.dbTables.vendors + '.id',

    config.vendorPortal.dbTables.vendorsActive + '.vendors_id',
    config.vendorPortal.dbTables.vendorsActive,

    config.vendorPortal.dbTables.vendorsActive + '.vendor_id',
    config.squareup.dbTables.squareupItems + '.vendor_id',

    config.vendorPortal.dbTables.vendorsActive + '.mon',
    config.squareup.dbTables.squareup + '.created_at',
    config.squareup.dbTables.squareup,
    config.squareup.dbTables.squareup + '.order_id',
    config.squareup.dbTables.squareupItems + '.order_id',
    config.squareup.dbTables.squareup + '.created_at',

    config.vendorPortal.dbTables.vendorsActive + '.yr',
    config.squareup.dbTables.squareup + '.created_at',
    config.squareup.dbTables.squareup,
    config.squareup.dbTables.squareup + '.order_id',
    config.squareup.dbTables.squareupItems + '.order_id',
    config.squareup.dbTables.squareup + '.created_at',

  ], db);
};
