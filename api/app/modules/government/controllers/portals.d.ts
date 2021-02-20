import { PoolConnection, RowDataPacket } from 'mysql2';
export declare const getPortalById: (id: number, db?: PoolConnection) => Promise<RowDataPacket>;
export declare const getPortalByIdent: (ident: string, db?: PoolConnection) => Promise<RowDataPacket>;
export declare const getPortalByServiceIdent: (service: string, ident: string, db?: PoolConnection) => Promise<RowDataPacket>;
