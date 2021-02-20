import { request as httpRequest } from 'https';

import { GoogleTokens } from './google.tokens';

export class GoogleRequests {
  constructor(
    public tokens: GoogleTokens
  ) { }

  public batchGetRange(sheetid: string, range: string[], majorDimension = 'ROWS'): Promise<any> {
    return this.tokens.token.then(token => {
      const ranges = range.map(r => `ranges=${encodeURIComponent(r)}`).join('&');
      // eslint-disable-next-line max-len
      const url = `/v4/spreadsheets/${encodeURIComponent(sheetid)}/values:batchGet?majorDimension=${encodeURIComponent(majorDimension)}&${ranges}`;
      return this.getRequest(token, 'sheets.googleapis.com', url);
    });
  }

  public getRange(sheetid: string, range: string, majorDimension = 'ROWS'): Promise<any> {
    return this.tokens.token.then(token => {
      // eslint-disable-next-line max-len
      const url = `/v4/spreadsheets/${encodeURIComponent(sheetid)}/values/${encodeURIComponent(range)}?majorDimension=${encodeURIComponent(majorDimension)}`;
      return this.getRequest(token, 'sheets.googleapis.com', url);
    });
  }

  public getRangeList(sheetid: string, range: string[], majorDimension = 'ROWS'): Promise<any> {
    return this.tokens.token.then(token => {
      const ranges = range.join('&ranges=');
      // console.log(ranges);
      // eslint-disable-next-line max-len
      const url = `/v4/spreadsheets/${encodeURIComponent(sheetid)}/values:batchGet?ranges=${ranges}&majorDimension=${encodeURIComponent(majorDimension)}`;
      return this.getRequest(token, 'sheets.googleapis.com', url);
    });
  }

  public appendRow(sheetid: string, range: string, values: any) {
    return this.tokens.token.then(token => {
      // eslint-disable-next-line max-len
      const url = `/v4/spreadsheets/${encodeURIComponent(sheetid)}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
      return this.postRequest(token, 'sheets.googleapis.com', url, values);
    });
  }

  public setRange(sheetid: string, range: string, values: any) {
    return this.tokens.token.then(token => {
      const url = `/v4/spreadsheets/${encodeURIComponent(sheetid)}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;
      return this.putRequest(token, 'sheets.googleapis.com', url, values);
    });
  }

  public getRequest(token: string, host: string, url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: host,
        port: 443,
        path: url,
        method: 'GET',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: { Authorization: `Bearer ${token}` },
      };

      let data = '';
      const req = httpRequest(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (d) => {
          data = `${data}${d}`;
        });
        res.on('end', () => {
          resolve(data);
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      req.end();
    });
  }

  public postRequest(token: string, host: string, url: string, post: any): Promise<any> {
    return new Promise((resolve, reject) => {

      const postData = JSON.stringify(post);

      /* eslint-disable @typescript-eslint/naming-convention */
      const options = {
        hostname: host,
        port: 443,
        path: url,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
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
          resolve(data);
        });
      });

      req.on('error', (e) => {
        reject(e);
      });
      req.write(postData);
      req.end();
    });
  }

  public putRequest(token: string, host: string, url: string, post: any): Promise<any> {
    return new Promise((resolve, reject) => {

      const postData = JSON.stringify(post);

      const options = {
        hostname: host,
        port: 443,
        path: url,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
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
          resolve(data);
        });
      });

      req.on('error', (e) => {
        reject(e);
      });
      req.write(postData);
      req.end();
    });
  }
}
