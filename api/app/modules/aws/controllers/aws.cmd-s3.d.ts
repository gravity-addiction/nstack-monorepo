import * as S3 from 'aws-sdk/clients/s3';
export declare const setS3FilePermission: (s3: S3, bucket: string, key: string, awsIdentId: string) => Promise<unknown>;
export declare const lsFolder: (s3: S3, bucket: string, prefix?: string, delimiter?: string, max?: number, startAfter?: string, continueToken?: string) => Promise<unknown>;
export declare const lsBuckets: (s3: S3) => Promise<unknown>;
