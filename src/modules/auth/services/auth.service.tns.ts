import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '@modules/app-config/index';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public authSource: BehaviorSubject<any>;
  public authFailed: Subject<any>;
  public authRefreshed$: Observable<any>;
  public authFailed$: Observable<any>;

  constructor(public http: HttpClient,
    public configService: ConfigService,
    public tokenService: TokenService
  ) {
    // console.log('Setting Up Auth Service')
    this.authSource = new BehaviorSubject<any>({});
    this.authFailed = new Subject<any>();
    this.authRefreshed$ = this.authSource.asObservable();
    this.authFailed$ = this.authFailed.asObservable();
    this.authSource.next(this.tokenService.authActive$.value || {});
  }

  httpAuthHeader(authToken: string, heads?: HttpHeaders) {
    return (heads instanceof HttpHeaders) ?
      heads.set('Authorization', 'Bearer ' + authToken) :
      new HttpHeaders().set('Authorization', 'Bearer ' + authToken);
  }

  login(username: string, password: string, captcha: string,
    rememberme = false, apiPath = ''
  ): Observable<HttpResponse<any>> {
    const authData: any = {
      username,
      password,
      rememberme,
      recaptcha: captcha,
    };

    if (!apiPath) {
      apiPath = this.configService.apiPath;
    }

    // console.log('Auth To', apiPath);
    return this.http.post<any>(apiPath + '/authenticate', authData, {
      observe: 'response',
      headers: this.configService.httpJsonHeader()
    }).
      pipe(
        catchError((err: any) => {
          this.authSource.next({});
          this.authFailed.next(err);
          return throwError(err);
        })
      );
  }

  logout(): void {
    this.authSource.next({});
  }

  removeServerToken(apiPath: string, authToken: string) {
    if (!apiPath) {
      apiPath = this.configService.apiPath;
    }
    return this.http.delete<any>(apiPath + '/authenticate', {
      headers: this.configService.httpJsonHeader(this.httpAuthHeader(authToken))
    }).subscribe();
  }

  deleteLogout(apiPath = '') {
    if (!apiPath) {
      apiPath = this.configService.apiPath;
    }
    return this.http.delete<any>(apiPath + '/authenticate');
  }

  changePassword(userId: number, oldpassword: string, password: string, authToken: string) {
    const body = {
      password,
      oldpassword,
    };
    return this.http.put<any>(this.configService.apiPath + '/auth/' + encodeURIComponent(userId) + '/password',
      body,
      {
        headers: this.configService.httpJsonHeader(this.httpAuthHeader(authToken))
      }
    );
  }

}
