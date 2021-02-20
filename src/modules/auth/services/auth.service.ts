import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '@modules/app-config/index';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public authSource = new BehaviorSubject<any>({});
  public authFailed = new Subject<any>();
  public authRefreshed$ = this.authSource.asObservable();
  public authFailed$ = this.authFailed.asObservable();

  constructor(public http: HttpClient,
              public configService: ConfigService,
              public tokenService: TokenService
  ) { }

  httpAuthHeader(authToken: string, heads?: HttpHeaders) {
    /*
        // console.log('Add Auth Header');
    const isCookie = this.isCookieToken(authToken);

    // console.log('Header Is Cookie?', isCookie);
    if (!isCookie) {
      headers.Authorization = 'Bearer ' + authToken;
    }

    return headers;
    */
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
    return this.http.post<any>(
        this.configService.apiPath + '/authenticate',
        authData,
        { observe: 'response',
        headers: this.configService.httpJsonHeader() }
      ).
      pipe(
        tap((resp) => {
         if (this.tokenService.hasActiveToken()) {
            this.authSource.next(this.tokenService.getActiveJson());
            if (resp.status === 200) {
              // Check for server forwarding
              const respBody: any = resp.body || {};
                    const forwardTo = respBody.forwardTo || '';
                    const hardForward = respBody.hardForward || '';

              // Previous Page
              if (hardForward) {
                (window as any).location = forwardTo;
              }//  else if (forwardTo) {
              //  this.router.navigateByUrl(forwardTo);
              // }
            }
          } else {
            this.authSource.next({});
            this.authFailed.next({statusText: 'Please Try Again, Invalid Token.'});
          }
        }),
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
    return this.http.delete<any>(apiPath + '/authenticate').subscribe(() => {
      this.logout();
    }, () => {
      this.logout();
    });
  }

  changePassword(userId: number, oldpassword: string, password: string, authToken: string) {
    const body = {
      password,
      oldpassword,
    };
    return this.http.put<any>(
        this.configService.apiPath + '/auth/' + encodeURIComponent(userId) + '/password',
        body,
        { headers: this.configService.httpJsonHeader() }
    );
  }

}
