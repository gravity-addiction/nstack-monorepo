import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AuthService } from '@modules/auth/services/auth.service';
import { TokenService } from '@modules/auth/services/token.service';

@Component({
  selector: 'app-logout-component',
  templateUrl: './logout.component.html'
})
export class LogoutComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private tokenService: TokenService
  ) {
    this.authService.deleteLogout().subscribe();
  }

  ngOnInit() {
    this.tokenService.authActive$.next({});
    this.tokenService.removeActiveIdent();
    this.tokenService.removeCookieToken();
    this.authService.logout();
    setTimeout(() => {
      (window as any).location = '/';
    }, 1000);
  }

}
