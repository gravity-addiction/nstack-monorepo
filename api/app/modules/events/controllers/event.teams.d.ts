import { PoolConnection, RowDataPacket } from 'mysql2';
export declare const getEventTeamsByComp: (eventSlug?: string, compId?: number, db?: PoolConnection) => Promise<RowDataPacket[]>;
export declare const getEventTeam: (id?: number, db?: PoolConnection) => Promise<RowDataPacket>;
export declare const createEventTeam: (body: any, db?: PoolConnection) => Promise<RowDataPacket>;
