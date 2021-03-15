import { ChangeDetectorRef, Component, ElementRef, OnInit, OnDestroy, NgZone, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '@src/modules/auth/services/auth.service';
import { HelperService } from '@src/modules/app-common/services/helper-scripts.service';
import { ConfigService } from '@src/modules/app-config/config.service';
import { RecaptchaV3Service } from '@src/modules/g-recaptcha/recaptcha-v3.service';
import { TokenService } from '@src/modules/auth/services/token.service';

import { Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('loginForm', { static: true }) loginForm!: NgForm;
  @ViewChild('userEle', { static: true }) userEle!: ElementRef;
  subscriptions: Subscription = new Subscription();

  model: any = {
    username: '',
    password: '',
    rememberme: true
  };
  loading = false;
  returnUrl!: string;
  gotCallback = false;
  loginAttempted = false;

  public authFailed = '';

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private configService: ConfigService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private helperService: HelperService,
    private recaptchaService: RecaptchaV3Service,
    private tokenService: TokenService
  ) {
    // get return url from route parameters or default to '/'
    this.subscriptions.add(
      this.authService.authFailed$.subscribe((err: any) => {
        this.authFailed = err.statusText;
        this.model.password = '';
        this.loading = false;
        this.changeDetectorRef.detectChanges();
        this.authFailed = '';
      })
    );

    (window as any).onloadCallback = this.onloadCallback.bind(this);
    if (this.configService.config.recaptchaKey) {
      const queryArgs = 'render=' + encodeURIComponent(this.configService.config.recaptchaKey);
      this.helperService.loadScript('recaptcha', queryArgs);
    }
  }

  onloadCallback() {
    this.gotCallback = true;
    // console.log('Recaptcha Callback');
  }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.userEle.nativeElement.focus();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  gotoPassword(pw) {
    pw.focus();
  }

  async login() {
    const token = (this.configService.config.recaptchaKey) ? await this.recaptchaService.executeReturn('login') : null;
    this.loading = true;
    this.authFailed = '';
    this.loginAttempted = true;

    const mPass = this.model.password;
    const mUser = this.model.username;
    const rememberMe = this.model.rememberme;

    if (!mUser || !mPass) {
      this.loading = false;
      return;
    }

    this.subscriptions.add(
      this.authService.login(
        mUser,
        mPass,
        token,
        rememberMe
      ).pipe(
        tap((resp: any) => {
          if (resp.ok && this.tokenService.cookiesEnabled) {
            this.tokenService.useCookieToken();
          }
          if (resp.ok) {
            this.model.password = '';
            if (!this.model.rememberme) {
              this.model.username = '';
              this.model.rememberme = true;
            }
            (window as any).location = '/';
          } else {
            this.authFailed = resp.statusText || 'Auth Error';
          }
        }),
        catchError((err: any) => {
          console.log(err);
          this.loading = false;
          this.authFailed = err.statusText || 'Service Error';
          this.changeDetectorRef.detectChanges();
          (window as any).location = '/';
          throw err;
        })
      ).subscribe()
    );
  }

}

