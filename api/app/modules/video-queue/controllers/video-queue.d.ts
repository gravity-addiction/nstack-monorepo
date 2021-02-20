import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';
export declare const getVideoQueueList: (offset: number, limit: number, db?: PoolConnection) => Promise<RowDataPacket[]>;
export declare const addVideoQueueSplice: (videoQueueId: number, spliceEvent: string, spliceTimestamp: string, db?: PoolConnection) => Promise<ResultSetHeader>;
