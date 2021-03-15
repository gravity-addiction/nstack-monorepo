import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

import { IConfig } from './models/i-config';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  public config: IConfig = {} as IConfig;
  private http: HttpClient;
  private configVersion = '2';

  constructor(handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  loadConfig(conf: IConfig): Promise<IConfig> {
    return this.http.get<IConfig>(`assets/config.json?version=${this.configVersion}`).pipe(
      tap(config => {
        this.config = Object.assign({}, config as IConfig, conf as IConfig, {
          ////// Hardcoded config variables, use with caution
          // apiServer: 'https://ourplace.vendorportal.org',
          // apiPath: '/api',
          // authTokenKey: '_AID',
          // recaptchaKey: '6LdmwMMZAAAAACHo313MiP4FClZRFhO60yIpwdtc'
        });
      })
    ).toPromise();
  }

  httpJsonHeader(heads?: HttpHeaders) {
    return (heads instanceof HttpHeaders) ?
      heads.append('Content-Type', 'application/json') :
      // eslint-disable-next-line @typescript-eslint/naming-convention
      new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  customApiPath(server: string) {
    return (server || '').toString() + (this.config.apiPath || '').toString();
  }

  set apiServer(server: string) {
    this.config.apiServer = server;
  }

  get apiPath() {
    return (this.config.apiServer || '').toString() + (this.config.apiPath || '').toString();
  }
}
