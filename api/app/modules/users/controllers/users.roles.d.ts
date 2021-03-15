import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';
export declare const getUserRoles: (id: number, db?: PoolConnection) => Promise<any>;
export declare const addRole: (id: number, role: string, area?: string, db?: PoolConnection) => Promise<ResultSetHeader>;
export declare const getRoles: (id: number, db?: PoolConnection) => Promise<RowDataPacket[]>;
