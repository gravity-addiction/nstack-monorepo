import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { IConfig } from './models/i-config';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  public config: IConfig = {} as IConfig;

  constructor() { }

  loadConfig(conf: IConfig): Promise<IConfig> {
    // this.config = conf as IConfig;
    // return Promise.resolve(this.config);

    this.config = Object.assign({}, conf as IConfig, {
      ////// Hardcoded config variables, use with caution
      // apiServer: 'https://ourplace.vendorportal.org',
      // apiPath: '/api',
      // authTokenKey: '_AID',
      // recaptchaKey: '6LdmwMMZAAAAACHo313MiP4FClZRFhO60yIpwdtc'
    });
    return Promise.resolve(this.config);

  }

  httpJsonHeader(heads?: HttpHeaders) {
    return (heads instanceof HttpHeaders) ?
      heads.set('Content-Type', 'application/json') :
      new HttpHeaders().set('Content-Type', 'application/json');
  }

  customApiPath(server: string) {
    return (server || '').toString() + (this.config.apiPath || '').toString();
  }

  set apiServer(server: string) {
    this.config.apiServer = server;
  }

  get apiPath() {
    // console.log('T', this.config);
    // console.log('H', (this.config.apiServer || '').toString() + (this.config.apiPath || '').toString());
    return this.customApiPath(this.config.apiServer);
  }
}
