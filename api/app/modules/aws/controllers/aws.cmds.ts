/* eslint-disable @typescript-eslint/naming-convention */
import { IAM, S3 } from 'aws-sdk';

/*
const s3 = new S3({
  accessKeyId : config.aws_access_key_id,
  secretAccessKey : config.aws_secret_access_key,
  signatureVersion: 'v4',
  region: config.region,
  apiVersion: '2006-03-01'
});
*/
// const createUser = util.promisify(iam.createUser);
// const addUserToGroup = util.promisify(iam.addUserToGroup);
// const createAccessKey = util.promisify(iam.createAccessKey);
export const checkUser = async (iam: IAM, username: string) =>

  new Promise((resolve, reject) => {
    iam.getUser({ UserName: username }, (err: any, data: any) => (err) ? reject(err) : resolve(data));
  });

export const createUser = (iam: IAM, username: string) =>
  new Promise((resolve, reject) => {
    iam.createUser({UserName: username}, (err: any, data: any) => (err) ? reject(err) : resolve((data || {}).User));
  });

export const addUserToGroup = (iam: IAM, username: string, group: string) =>
  new Promise((resolve, reject) => {
    iam.addUserToGroup({UserName: username, GroupName: group}, (err: any, data: any) => (err) ? reject(err) : resolve(data));
  });

export const createAccessKey = (iam: IAM, username: string) =>
  new Promise((resolve, reject) => {
    iam.createAccessKey({UserName: username}, (err: any, data: any) => (err) ? reject(err) : resolve(data));
  });

export const deleteAccessKey = (iam: IAM, username: string, key: string) =>
  new Promise((resolve, reject) => {
    iam.deleteAccessKey({AccessKeyId: key, UserName: username}, (err: any, data: any) => (err) ? reject(err) : resolve(data));
  });

export const listObjectsV2 = (s3: S3, bucket: string, prefix = '', delimiter = '/', max = 100, startAfter = '', continueToken = '') =>
  new Promise((resolve, reject) => {
    const params: any = { Bucket: bucket };
    if (continueToken) {
      params.ContinuationToken = continueToken;
    }
    if (max) {
      params.MaxKeys = max;
    }
    if (prefix) {
      params.Prefix = prefix;
    }
    if (startAfter) {
      params.StartAfter = startAfter;
    }
    if (delimiter) {
      params.Delimiter = delimiter;
    }

    s3.listObjectsV2(params, (err: any, data: any) => (err) ? reject(err) : resolve(data));
  });

export const listBuckets = (s3: S3) =>
  new Promise((resolve, reject) => {
    s3.listBuckets((err: any, data: any) => (err) ? reject(err) : resolve(data));
  });

export const getSignedUrl = (s3: S3, bucket: string, key: string) =>
  new Promise((resolve, reject) => {
    const params = {Bucket: bucket, Key: key};
    s3.getSignedUrl('getObject', params, (err: any, data: any) => (err) ? reject(err) : resolve(data));
  });

export const putObject = (s3: S3, bucket: string, key: string, body: any, acl: any) =>
  new Promise((resolve, reject) => {
    s3.putObject({ACL: acl, Body: body, Bucket: bucket, Key: key}, (err: any, data: any) => (err) ? reject(err) : resolve(data));
  });

export const _grantRead = (s3: S3, bucket: string, key: string, grant: string) =>
  new Promise((resolve, reject) => {
    s3.putObjectAcl({Bucket: bucket, Key: key, GrantRead: grant}, (err: any, data: any) => (err) ? reject(err) : resolve(data));
  });

export const putObjectAcl = (s3: S3, bucket: string, key: string, body: any, acl: any) =>
  new Promise((resolve, reject) => {
    s3.putObject({ACL: acl, Body: body, Bucket: bucket, Key: key}, (err: any, data: any) => (err) ? reject(err) : resolve(data));
  });

export const deleteObject = (s3: S3, bucket: string, key: string) =>
  new Promise((resolve, reject) => {
    s3.deleteObject({Bucket: bucket, Key: key}, (err: any, data: any) => (err) ? reject(err) : resolve(data));
  });
