// import { config } from '@lib/config';
// import * as AWS_CognitoIdentity from 'aws-sdk/clients/cognitoidentity';
import * as AWS_IAM from 'aws-sdk/clients/iam';
import * as AWS_S3 from 'aws-sdk/clients/s3';
import * as AWS_Config from 'aws-sdk/global';

export const IAM = (userConfig: any): AWS_IAM => {
  const awsConfig = new AWS_Config.Config({
    accessKeyId: (userConfig || {}).aws_access_key_id,
    secretAccessKey: (userConfig || {}).aws_secret_access_key,
    region: (userConfig || {}).region,
    apiVersion: (userConfig || {}).apiVersion,
    signatureVersion: (userConfig || {}).signatureVersion,
  });
  return new AWS_IAM(awsConfig);
};

export const S3 = (userConfig: any): AWS_S3 => {
  const awsConfig = new AWS_Config.Config({
    accessKeyId: (userConfig || {}).aws_access_key_id,
    secretAccessKey: (userConfig || {}).aws_secret_access_key,
    region: (userConfig || {}).region,
    apiVersion: (userConfig || {}).apiVersion,
    signatureVersion: (userConfig || {}).signatureVersion,
  });
  return new AWS_S3(awsConfig);
};


// export const S3 = (keys.master._S3) ? keys.master._S3 : keys.master._S3 = new AWSS3({...keys.master.defaultS3, ...keys.master.config});
// export const signingParams = config.aws.signingParams;
