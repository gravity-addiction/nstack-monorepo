import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';
export declare const getUserById: (id: number, db?: PoolConnection) => Promise<RowDataPacket>;
export declare const getAllUsers: (db?: PoolConnection) => Promise<RowDataPacket[]>;
export declare const userCheck: (username: string, id?: number, db?: PoolConnection) => Promise<boolean>;
export declare const createUser: (body: any, db?: PoolConnection) => Promise<RowDataPacket>;
export declare const updateUserInfo: (id: number, body: any, db?: PoolConnection) => Promise<RowDataPacket>;
export declare const deleteUser: (userId: number, db?: PoolConnection) => Promise<ResultSetHeader>;
