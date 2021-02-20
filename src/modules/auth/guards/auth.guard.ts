import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ConfigService } from '@modules/app-config/config.service';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { TokenService } from '../services/token.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
    private configService: ConfigService,
    private http: HttpClient,
    private location: Location,
    private tokenService: TokenService
  ) { }

  goUpOne(_route: ActivatedRouteSnapshot) {
    const urlMap: string[] = [];
    _route.pathFromRoot.forEach(pR => {
      urlMap.push(...pR.url.map(p => p.path));
    });
    if (urlMap.length > 2) {
      urlMap.pop();
      this.router.navigate(urlMap);
    } else {
      this.router.navigate(['/']);
    }
  }
  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {

    return of(_route.queryParams).pipe(
      map(v => v.ak),
      switchMap((ak: any) =>
        (ak) ? this.http.post<any>(this.configService.apiPath + '/authenticate', { ak }, { observe: 'response' }) : of(false)
      ),
      tap((resp) => {
        if (!resp) {
          return;
        }

        const paramObj: any = Object.assign({}, _route.queryParams);
        paramObj.ak = null;
        this.location.replaceState(
          this.router.createUrlTree(
            _route.url.map(p => p.path),
            { queryParams: paramObj }
          ).toString()
        );
      }),
      map(() => {
        if (this.tokenService.hasActiveToken()) {
          return true;
        } else {
          this.goUpOne(_route);
          return false;
        }
      }),
      catchError((_err: any) => {
        if (_err.status && _err.status === 401) {
          this.goUpOne(_route);
        } else {
          this.router.navigate(['/']);
        }
        return of(this.tokenService.hasActiveToken());
      })
    );

  }
}
