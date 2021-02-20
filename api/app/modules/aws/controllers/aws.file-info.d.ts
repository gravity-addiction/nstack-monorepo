import { PoolConnection, RowDataPacket } from 'mysql2';
export declare const saveVideoUploadData: (key: string, filename: string, frmdata: any, db?: PoolConnection) => Promise<import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader")>;
export declare const getVideoUploadEvent: (shortId: string, eventId: string, db?: PoolConnection) => Promise<RowDataPacket[]>;
export declare const getKeySdobData: (eTags: string[], db?: PoolConnection) => Promise<any[]>;
