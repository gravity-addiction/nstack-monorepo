import { config } from '@lib/config';
import { readFileSync } from 'fs';
import { get as httpGet, request as httpRequest } from 'https';
import { sign as jwt_sign } from 'jsonwebtoken';
import { dirname as path_dirname, isAbsolute, resolve as path_resolve } from 'path';
import { stringify as querystring_stringify } from 'querystring';


export class GoogleTokens {
  /* eslint-disable @typescript-eslint/naming-convention */
  private _API_TOKEN = '';
  private _API_TOKEN_EXPIRES = 0;
  private _tokenPromise!: Promise<any> | null;
  private _timer: any;

  private _API_TOKEN_V3 = '';
  private _API_TOKEN_EXPIRES_V3 = 0;
  private _tokenPromiseV3!: Promise<any> | null;
  private _timerV3: any;

  constructor() {
    this.getTokenV4().then(d => {}).catch(e => console.log('Token Error V4: ', JSON.stringify(e)));
    this.getTokenV3().then(d => {}).catch(e => console.log('Token Error V3: ', JSON.stringify(e)));
    this.setTimer();
  }

  public get token(): Promise<string> {
    if (this._API_TOKEN !== '' && this._API_TOKEN_EXPIRES > ((Date.now() / 1000) + 3300)) {
      // console.log('Reusing', this._API_TOKEN_EXPIRES, ((Date.now() / 1000) + 3300));
      return Promise.resolve(this._API_TOKEN);
    }

    if (this._tokenPromise) {
      // console.log('Token Promise');
      return this._tokenPromise;
    }

    // console.log('Fetching New Token');
    return this.getTokenV4();
  }

  public get tokenV3(): Promise<string> {
    if (this._API_TOKEN_V3 !== '' && this._API_TOKEN_EXPIRES_V3 > ((Date.now() / 1000) + 3300)) {
      // console.log('Reusing', this._API_TOKEN_EXPIRES, ((Date.now() / 1000) + 3300));
      return Promise.resolve(this._API_TOKEN_V3);
    }

    if (this._tokenPromiseV3) {
      // console.log('Token Promise');
      return this._tokenPromiseV3;
    }

    // console.log('Fetching New Token');
    return this.getTokenV3();
  }

  private setTimer() {
    try {
      clearInterval(this._timer);
    } catch (e) {}
    this._timer = setInterval(this.getTokenV4, 3300 * 1000);
    try {
      clearInterval(this._timerV3);
    } catch (e) {}
    this._timerV3 = setInterval(this.getTokenV3, 3400 * 1000);
  }

  private getTokenV4(): Promise<string> {
    if (config.google.GOOGLE_API_SERVICE_ACCT && !isAbsolute(config.google.GOOGLE_API_SERVICE_ACCT)) {
      config.google.GOOGLE_API_SERVICE_ACCT = path_resolve(config.confDir, config.google.GOOGLE_API_SERVICE_ACCT);
    }

    this._tokenPromise = new Promise((resolve, reject) => {
      let keyFileBuf!: Buffer;
      let keyInfo!: any;
      let privateKey = '';
      try {
        keyFileBuf = readFileSync(config.google.GOOGLE_API_SERVICE_ACCT);
        keyInfo = JSON.parse(keyFileBuf.toString());
        privateKey = keyInfo.replace('-----BEGIN PRIVATE KEY-----\n', '').replace('\n-----END PRIVATE KEY-----\n', '');
      } catch (e) {} // get private key

      // console.log(keyInfo);

      // try { cert = readFileSync(certPem); } catch (e) {} // get private key

      const tokenExp = Math.floor(Date.now() / 1000) + 3600;
      const token = jwt_sign({
        iss: keyInfo.client_email,
        scope: 'https://www.googleapis.com/auth/spreadsheets',
        aud: 'https://www.googleapis.com/oauth2/v4/token',
        exp: tokenExp,
        iat: Math.floor(Date.now() / 1000),
      },
      keyInfo.private_key,
      { algorithm: 'RS256'});

      const postData = querystring_stringify({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: token,
      });

      const options = {
        hostname: 'www.googleapis.com',
        port: 443,
        path: '/oauth2/v4/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData),
        },

      };


      let data = '';
      const req = httpRequest(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (d) => {
          data = `${data}${d}`;
        });
        res.on('end', () => {
          const resp = JSON.parse(data);
          if (resp.error) {
            reject(`${resp.error}\n${resp.error_description}`);
            this._tokenPromise = null;
          } else {
            // console.log('Good! V4', resp);
            this._API_TOKEN = resp.access_token;
            this._API_TOKEN_EXPIRES = tokenExp;
            resolve(resp.access_token);
            this._tokenPromise = null;
          }
        });
      });

      req.on('error', (e) => {
        reject(e);
        this._tokenPromise = null;
      });

      req.write(postData);
      req.end();
    });

    return this._tokenPromise;
  }



  private getTokenV3(): Promise<string> {

    if (config.google.GOOGLE_API_SERVICE_ACCT && !isAbsolute(config.google.GOOGLE_API_SERVICE_ACCT)) {
      config.google.GOOGLE_API_SERVICE_ACCT = path_resolve(config.confDir, config.google.GOOGLE_API_SERVICE_ACCT);
    }

    this._tokenPromiseV3 = new Promise((resolve, reject) => {
      let keyFileBuf!: Buffer;
      let keyInfo!: any;
      let privateKey = '';
      try {
        keyFileBuf = readFileSync(config.google.GOOGLE_API_SERVICE_ACCT);
        keyInfo = JSON.parse(keyFileBuf.toString());
        privateKey = keyInfo.replace('-----BEGIN PRIVATE KEY-----\n', '').replace('\n-----END PRIVATE KEY-----\n', '');
      } catch (e) {} // get private key

      // console.log(keyInfo);

      const tokenExp = Math.floor(Date.now() / 1000) + 3600;
      const token = jwt_sign({
        iss: keyInfo.client_email,
        scope: 'https://www.googleapis.com/auth/drive',
        aud: 'https://oauth2.googleapis.com/token',
        exp: tokenExp,
        iat: Math.floor(Date.now() / 1000),
      },
      keyInfo.private_key,
      { algorithm: 'RS256'});

      const postData = querystring_stringify({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: token,
      });

      const options = {
        hostname: 'oauth2.googleapis.com',
        port: 443,
        path: '/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData),
        },

      };


      let data = '';
      const req = httpRequest(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (d) => {
          data = `${data}${d}`;
        });
        res.on('end', () => {
          const resp = JSON.parse(data);
          if (resp.error) {
            reject(`${resp.error}\n${resp.error_description}`);
            this._tokenPromiseV3 = null;
          } else {
            // console.log('Good! V3', resp);
            this._API_TOKEN_V3 = resp.access_token;
            this._API_TOKEN_EXPIRES_V3 = tokenExp;
            resolve(resp.access_token);
            this._tokenPromiseV3 = null;
          }
        });
      });

      req.on('error', (e) => {
        reject(e);
        this._tokenPromiseV3 = null;
      });

      req.write(postData);
      req.end();
    });

    return this._tokenPromiseV3;
  }
}
