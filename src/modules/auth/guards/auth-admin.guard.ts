import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';

import { TokenService } from '../services/token.service';

@Injectable()
export class AuthAdminGuard implements CanActivate {

  constructor(private tokenService: TokenService) { }

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    const user = this.tokenService.getActiveJson();
    if (user.hasOwnProperty('role')) {
      if (user.role === 'admin') {
        return true;
      }
    }
    return false;
  }
}
