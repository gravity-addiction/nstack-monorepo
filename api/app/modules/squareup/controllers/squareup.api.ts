import { config } from '@lib/config';
import * as https from 'https';
import * as url from 'url';

export const iSODateString = (d: Date): string => {
  const pad = (n: number) => (n < 10 ? '0' + n : n);

  return d.getUTCFullYear() + '-'
        + pad(d.getUTCMonth() + 1) + '-'
        + pad(d.getUTCDate()) + ' T'
        + pad(d.getUTCHours()) + ':'
        + pad(d.getUTCMinutes()) + ':'
        + pad(d.getUTCSeconds()) + 'Z';
};

export const getSquareupToken = (sandbox: boolean | null = null): any => {
  if (sandbox === null) {
    sandbox = config.squareup.useSandbox;
  }
  if (!sandbox) {
    return Object.assign({}, config.squareup.production);
  } else {
    return Object.assign({}, config.squareup.sandbox);
  }
};

export const createEndpoint = (endpoint: string, location: string | null = null, apiVersion = 'v2', sqToken: any = null): string => {
  if (!sqToken) {
    sqToken = getSquareupToken(config.squareup.useSandbox);
  }
  // console.log('Token', sqToken);
  let path = (sqToken.apiUrl) + encodeURIComponent(apiVersion) + '/';

  if (location && apiVersion === 'v2') {
    path += 'locations/' + encodeURIComponent(location) + '/';
  } else if (location) {
    path += encodeURIComponent(location) + '/';
  }
  path += endpoint;

  return path;
};

export const createOAuthEndpoint = (sqToken: any = null): string => {
  if (!sqToken) {
    sqToken = getSquareupToken(config.squareup.useSandbox);
  }
  // console.log('Token', sqToken);
  const path = (sqToken.apiUrl) + 'oauth2/token';
  return path;
};

export const squareupExecute = (
  sqToken: any, endpoint: string, method = 'GET', post: any = null, squareVersion: string | null = null
): Promise<any> =>
  new Promise((resolve, reject) => {
    // console.log(endpoint);
    // console.log('Execute', endpoint, sqToken);
    const options: any = url.parse(endpoint);
    options.method = method;
    /* eslint-disable @typescript-eslint/naming-convention */
    options.headers = {
      Authorization: 'Bearer ' + sqToken.accessToken,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Square-Version': (squareVersion || sqToken.apiVersion || '2020-12-16')
    };
    // console.log('Options', options);

    let body = '';
    const req = https.request(options, (res) => {
      // console.log(`STATUS: ${res.statusCode}`);
      // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        // console.log('Got To End', body);
        // const data = Buffer.concat(body).toString();
        let json = body;
        try {
          json = JSON.parse(body);
        } catch (e) {
          json = body;
        }

        // console.log(json);
        resolve({status: res.statusCode, headers: res.headers, data: json});
        // console.log('No more data in response.');
      });
    });

    req.on('error', (e) => {
      reject(e);
      console.error(`problem with request: ${e.message}`);
    });

    // write data to request body
    if (post) {
      // console.log('Writing Post', post);
      req.write(post);
    }
    req.end();
  });
