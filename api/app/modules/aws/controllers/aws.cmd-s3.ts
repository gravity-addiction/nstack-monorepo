import * as S3 from 'aws-sdk/clients/s3';

import * as AwsCmds from './aws.cmds';

export const setS3FilePermission = (s3: S3, bucket: string, key: string, awsIdentId: string) =>
  AwsCmds._grantRead(s3, bucket, key, awsIdentId);

export const lsFolder = (s3: S3, bucket: string, prefix = '', delimiter = '', max = 100, startAfter = '', continueToken = '') =>
  AwsCmds.listObjectsV2(s3, bucket, prefix, delimiter, max, continueToken, continueToken);

export const lsBuckets = (s3: S3) =>
  AwsCmds.listBuckets(s3);
