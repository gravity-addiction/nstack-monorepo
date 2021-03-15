import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private tokenService: TokenService) { }

  addAuthHeader(request: HttpRequest<any>) {
    // console.log('Add Auth Header');
    const authToken = this.tokenService.authActive$.value || '';
    const isCookie = this.tokenService.isCookieToken(authToken);

    // console.log('Header Is Cookie?', isCookie);
    if (!isCookie && (request.url || '').substr(-12, 12) !== 'authenticate') {
      return request.clone({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        setHeaders: { Authorization: 'Bearer ' + authToken },
      });
    }
    return request;
  }

  processSuccessResponse(request: HttpRequest<any>, next: HttpHandler, event: HttpResponse<any>): void {
    // do stuff with response if you want
    try {
      const jwt = event.headers.get('x-jwt') || '';
      if (jwt) {
        // console.log('Header JWT', jwt);
        // const activeJson = this.tokenService.authActive$.value || {};
        // console.log('Active', activeJson);
        // console.log('Request', request.body);
        const addedIdent = this.tokenService.addToken(jwt, (request.body || {}).rememberme, '');
        if (addedIdent) {
          // console.log('Process Success Added Ident', addedIdent);
          this.tokenService.updateAuthCollection();
          this.tokenService.setActiveIdent(addedIdent);
          this.authService.authSource.next(this.tokenService.getLoginJson(addedIdent) || {});
        }
      }
    } catch (err) {
      console.log('Process Errored, did not add jwt', err);
    }
  }

  processErrorResponse(request: HttpRequest<any>, next: HttpHandler, error: any): Observable<HttpEvent<any>> {
    console.log('Error Status', error.status);
    if (error.status === 401) { // No Token Force Full Login
      // this.authService.logout();

    } else if (error.status === 402) {
      alert('Sorry! this app version no longer supported.\n' +
            'Please purchase the updated app store or play store versions. ' +
            'Thank you for your support.');


    } else if (error.status === 403) {
      // alert('You do not have permission to access this resource.');


    } else if (error.status === 498) {
      this.tokenService.remove(this.tokenService.authTokenId);
      this.authService.logout();
      (window as any).location = '/';

    } else if (error.status === 500) {
      // alert('Server Error, Please try Again.');

    }

    this.authService.authFailed.next({statusText: ''});
    return observableThrowError(error);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let requestMethod: string = request.method;
    requestMethod = requestMethod.toLowerCase();

    // Add Auth to all requests
    // request = this.addAuthHeader(request);

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.processSuccessResponse(request, next, event);
        }
      }),
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
            return this.processErrorResponse(request, next, err);
        } else {
            return observableThrowError(err);
        }
        })
    );

  }
}
