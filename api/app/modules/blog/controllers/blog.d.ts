import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';
export declare const getBlogAll: (db?: PoolConnection) => Promise<RowDataPacket[]>;
export declare const getBlogById: (id: number, db?: PoolConnection) => Promise<RowDataPacket>;
export declare const getBlogBySlug: (slug: string, db?: PoolConnection) => Promise<RowDataPacket>;
export declare const createPost: (body: any, db?: PoolConnection) => Promise<RowDataPacket>;
export declare const updatePost: (body: any, id: number, db?: PoolConnection) => Promise<RowDataPacket>;
export declare const deletePost: (id: number, db?: PoolConnection) => Promise<ResultSetHeader>;
