import { config } from '@lib/config';
import { first, query } from '@lib/db';
import { PoolConnection, RowDataPacket } from 'mysql2';

export const getInvoiceById = (id: number, db?: PoolConnection): Promise<RowDataPacket> =>
  query<RowDataPacket[]>(
      'SELECT * FROM ?? WHERE `id` = ? LIMIT 1',
      [config.invoices.dbTables.invoices, id],
      db
  ).
  then(resp => first(resp));


export const getInvoiceByPayId = (slug: string, db?: PoolConnection): Promise<RowDataPacket> =>
  query<RowDataPacket[]>(
      'SELECT * FROM ?? WHERE `slug` = ? LIMIT 1',
      [config.invoices.dbTables.invoices, slug],
      db
  ).
  then(resp => first(resp));


export const getInvoiceItemById = (id: number, db?: PoolConnection): Promise<RowDataPacket> =>
  query<RowDataPacket[]>(
      'SELECT * FROM ?? WHERE `id` = ? LIMIT 1',
      [config.invoices.dbTables.invoiceItems, id],
      db
  ).
  then(resp => first(resp));


export const getInvoiceItems = (invoiceId: number, db?: PoolConnection): Promise<RowDataPacket[]> =>
  query<RowDataPacket[]>(
      'SELECT * FROM ?? WHERE `invoice_id` = ?',
      [config.invoices.dbTables.invoiceItems, invoiceId],
      db
  );


export const getInvoicePayments = (invoiceId: number, db?: PoolConnection): Promise<RowDataPacket[]> =>
  query<RowDataPacket[]>(
      'SELECT * FROM ?? WHERE `invoice_id` = ?',
      [config.invoices.dbTables.invoicePayments, invoiceId],
      db
  ).
  then((results: any[]) =>
    results.map((result: any) => {
      try {
        result.transaction = JSON.parse(result.transaction) || result.transaction;
      } catch(e) { }
      return result;
    })
  );
