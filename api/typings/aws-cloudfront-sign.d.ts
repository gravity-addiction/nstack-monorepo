declare module 'aws-cloudfront-sign' {
  export function getSignedUrl(cfUrl: string, params: any): string;
  export function getSignedRTMPUrl(domainname: string, s3key: string, params: any): any;
  export function getSignedCookies(cfUrl: string, params: any): any;
  export function normalizeBase64(str: string): string;
  export function normalizeSignature(sig: string): string;
  export function _getExpireTime(opts: any): number;
  export function _getIpRange(opts: any): any;
}
