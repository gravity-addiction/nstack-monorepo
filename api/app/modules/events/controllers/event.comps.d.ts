import { PoolConnection, RowDataPacket } from 'mysql2';
export declare const getEventComps: (eventId: number, db?: PoolConnection) => Promise<RowDataPacket[]>;
export declare const getEventWithComps: (eventSlug: string, db?: PoolConnection) => Promise<RowDataPacket[]>;
