import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';

import { TokenService } from '../services/token.service';

@Injectable()
export class AuthAdminGuard implements CanActivate, CanLoad {

  constructor(
    private router: Router,
    private tokenService: TokenService
  ) { }

  canLoad(_route: Route, _segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user = this.tokenService.authActive$.value || {};
    if (user.hasOwnProperty('role') && user.role === 'admin') {
      return true;
    } else {
      return this.router.createUrlTree(
        ['/login'],
        { queryParams: { } }
      );
    }
  }

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const user = this.tokenService.authActive$.value || {};
    if (user.hasOwnProperty('role')) {
      if (user.role === 'admin') {
        return of(true);
      }
    }
    return of(this.router.createUrlTree(
      ['/login'],
      { queryParams: { } }
    ));
  }
}
