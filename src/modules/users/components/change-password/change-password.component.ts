import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { TokenService } from '@modules/auth/services/token.service';
import { UserService } from '@modules/users-shared/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {
  returnUrl!: string;
  model: any = {};

  changeErr = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tokenService: TokenService,
    private userService: UserService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  changepassword() {
    console.log('Change Pass');
    const userInfo = this.tokenService.authActive$.value || {};
    this.userService.password(userInfo, this.model.oldpassword, this.model.newpassword).pipe(
      tap((resp) => {
        console.log('Resp', resp);
        this.router.navigateByUrl(this.returnUrl);
      }),
      catchError((err: any) => {
        console.log('Change Password Error', err);
        throw err;
      })
    ).subscribe();
  }
}
