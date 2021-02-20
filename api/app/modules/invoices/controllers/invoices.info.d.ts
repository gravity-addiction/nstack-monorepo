import { PoolConnection, RowDataPacket } from 'mysql2';
export declare const getInvoiceById: (id: number, db?: PoolConnection) => Promise<RowDataPacket>;
export declare const getInvoiceByPayId: (slug: string, db?: PoolConnection) => Promise<RowDataPacket>;
export declare const getInvoiceItemById: (id: number, db?: PoolConnection) => Promise<RowDataPacket>;
export declare const getInvoiceItems: (invoiceId: number, db?: PoolConnection) => Promise<RowDataPacket[]>;
export declare const getInvoicePayments: (invoiceId: number, db?: PoolConnection) => Promise<RowDataPacket[]>;
