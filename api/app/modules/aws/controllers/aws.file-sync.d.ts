import { PoolConnection, RowDataPacket } from 'mysql2';
export declare const initFileSyncSQL: (sql: string, values: (string | number)[], server: string, bucket: string, key: string, delimiter: string, max: number, startAfter: number) => any;
export declare const lsFolder: (server: string, bucket: string, key: string, delimiter: string, max: number, startAfter: number, db?: PoolConnection) => Promise<RowDataPacket[]>;
export declare const fetchVideoBatch: (fileList: Array<any>, db?: PoolConnection) => Promise<any[]>;
export declare const fetchFolderBatchS3: (server: string, bucket: string, prefixKey: string, folderList: Array<any>, db?: PoolConnection) => any[][] | Promise<any[]>;
export declare const fetchFolderBatchFileSync: (server: string, bucket: string, prefixKey: string, folderList: Array<any>, db?: PoolConnection) => any[][] | Promise<any[]>;
