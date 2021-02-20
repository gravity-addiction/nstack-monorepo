import { S3 } from 'aws-sdk';
export declare const createSignedUrlCloudFront: (signingParams: any, url: string, timeout?: number) => string;
export declare const createSignedCookie: (signingParams: any, url: string, timeout?: number) => any;
export declare const createSignedUrlS3: (s3: S3, bucket: string, key: string, signedUrlExpireSeconds?: number) => Promise<string>;
export declare const createSignedPostUrl: (s3: S3, bucket: string, key: string, content?: string, signedUrlExpireSeconds?: number) => Promise<string>;
