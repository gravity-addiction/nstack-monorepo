import { Component } from '@angular/core';

import { AuthService } from '@modules/auth/services/auth.service';
import { TokenService } from '@modules/auth/services/token.service';

@Component({
  selector: 'app-logout-component',
  templateUrl: './logout.component.html'
})
export class LogoutComponent {

  constructor(
    private authService: AuthService,
    private tokenService: TokenService
  ) {
    this.tokenService.removeTokens();
    this.authService.deleteLogout();
    // this.authenticationService.logout(['/']);
  }

}
