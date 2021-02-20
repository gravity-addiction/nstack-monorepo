import { getSignedCookies, getSignedUrl } from 'aws-cloudfront-sign';
import { S3 } from 'aws-sdk';

// Generating a signed URL
export const createSignedUrlCloudFront = (signingParams: any, url: string, timeout: number = 8): string => {
  signingParams.expireTime = (new Date().getTime() + (((timeout) ? timeout : 8) * 1000));
  const signedUrl = getSignedUrl(
    url,
    signingParams
  );
  return signedUrl;
};


// Generating a signed Cookie
export const createSignedCookie = (signingParams: any, url: string, timeout: number = 30): any => {
  signingParams.expireTime = (new Date().getTime() + (((timeout) ? timeout : 30) * 1000));
  const signedCookies = getSignedCookies(
    url,
    signingParams
  );
  signedCookies['CloudFront-Expires'] = signingParams.expireTime;

  return signedCookies;
};

export const createSignedUrlS3 = (s3: S3, bucket: string, key: string, signedUrlExpireSeconds: number = 300): Promise<string> =>
  new Promise((resolve, reject) => {
    /* eslint-disable @typescript-eslint/naming-convention */
    const params = {
      Bucket: bucket,
      Key: key,
      Expires: signedUrlExpireSeconds,
    };

    s3.getSignedUrl('getObject', params, (err: any, data: any) => (err) ? reject(err) : resolve(data));
  });

// eslint-disable-next-line max-len
export const createSignedPostUrl = (s3: S3, bucket: string, key: string, content: string = 'video/*', signedUrlExpireSeconds: number = 1200): Promise<string> =>
  new Promise((resolve, reject) => {
    /* eslint-disable @typescript-eslint/naming-convention */
    const params = {
      Bucket: bucket,
      Key: key,
      Expires: signedUrlExpireSeconds,
      ACL: 'bucket-owner-full-control',
      ContentType: content,
    };

    // console.log(params);
    s3.getSignedUrl('putObject', params, (err: any, data: any) => (err) ? reject(err) : resolve(data));
  });
