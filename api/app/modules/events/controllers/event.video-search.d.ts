import { PoolConnection, RowDataPacket } from 'mysql2';
export declare const getEventVideoFromSDOBox: (eventSlug: string, compId: number, teamNumber: string, rnd: number, db?: PoolConnection) => Promise<RowDataPacket>;
export declare const getEventVideoByCompInfo: (meet?: string, team?: string, rnd?: string, db?: PoolConnection) => Promise<number>;
