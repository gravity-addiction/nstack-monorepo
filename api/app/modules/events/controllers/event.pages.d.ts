import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';
export declare const getEventPage: (eventId: number, page: string, db?: PoolConnection) => Promise<RowDataPacket>;
export declare const getEventPageHistory: (eventId: number, page: string, db?: PoolConnection) => Promise<RowDataPacket[]>;
export declare const getEventPageById: (eventId: number, pageId: number, db?: PoolConnection) => Promise<RowDataPacket>;
export declare const eventPagesInsert: (eventId: number, page: string, content: string, db?: PoolConnection) => Promise<ResultSetHeader>;
