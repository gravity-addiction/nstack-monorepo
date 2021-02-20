import { Component, OnInit, NgZone } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
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
    private router: RouterExtensions,
    private tokenService: TokenService,
    private userService: UserService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = '/'; // this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  changepassword() {
    const userInfo = this.tokenService.getActiveJson();
    this.userService.password(userInfo, this.model.oldpassword, this.model.newpassword).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl);
    }, err => {
      // console.log('Change Password Error', err);
      this.changeErr = err.error.replace('_', ' ');
      if (this.changeErr === 'bad password') {
        this.model.oldpassword = '';
        this.changeErr = 'Wrong Old Password';
      }
    });
  }
}
