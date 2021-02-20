import { IAM } from 'aws-sdk';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2';
export declare const getAWSKeys: (userId: string, db?: PoolConnection) => Promise<RowDataPacket[]>;
export declare const getAWSKeySecret: (userId: string, key: string, db?: PoolConnection) => Promise<RowDataPacket>;
export declare const getAWSRequestCreds: (userId: string, db?: PoolConnection) => Promise<RowDataPacket>;
export declare const getAWSPostCreds: (userId: string, db?: PoolConnection) => Promise<RowDataPacket>;
export declare const removeAWSKeys: (iam: IAM, userId: string, key: string, db?: PoolConnection) => Promise<ResultSetHeader>;
export declare const generateAWSKeysForUser: (iam: IAM, userId: string, db?: PoolConnection) => Promise<any>;
