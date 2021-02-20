import { IAM, S3 } from 'aws-sdk';
import { PoolConnection, RowDataPacket } from 'mysql2';
export declare const getHomeUser: (userId: string) => Promise<RowDataPacket>;
export declare const addNewHomeUser: (iam: IAM, s3: S3, userId: string, username: string, usergroup?: string, server?: string, parentId?: string, db?: PoolConnection) => Promise<RowDataPacket>;
