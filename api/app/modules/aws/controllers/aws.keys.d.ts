import * as AWS_IAM from 'aws-sdk/clients/iam';
import * as AWS_S3 from 'aws-sdk/clients/s3';
export declare const IAM: (userConfig: any) => AWS_IAM;
export declare const S3: (userConfig: any) => AWS_S3;
