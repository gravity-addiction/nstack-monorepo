import { ChangeDetectorRef, Component, OnInit, OnDestroy, NgZone } from '@angular/core'; import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '@src/modules/auth/services/auth.service';
import { HelperService } from '@src/modules/app-common/services/helper-scripts.service';
import { ConfigService } from '@src/modules/app-config/config.service';
import { RecaptchaV3Service } from '@src/modules/g-recaptcha/recaptcha-v3.service';
import { UserService } from '@modules/users-shared/services/user.service';

import { Subscription } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  model: any = {
    username: '',
    password: '',
    store: ''
  };
  loading = false;
  returnUrl!: string;
  gotCallback = false;
  loginAttempted = false;
  loginForm!: any;

  public authFailed = '';

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private configService: ConfigService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private helperService: HelperService,
    private recaptchaService: RecaptchaV3Service,
    private userService: UserService,
    private zone: NgZone
  ) {
    // get return url from route parameters or default to '/'
    const returnUrl = (this.route.snapshot.queryParams.hasOwnProperty('returnUrl') ?
      this.route.snapshot.queryParams['returnUrl'] :
      false
    ) || false;
    const doLogoff = this.route.snapshot.queryParams.hasOwnProperty('x') || false;

    if (returnUrl || doLogoff) {
      this.authService.logout();
      this.router.navigateByUrl('/login');
    }

    this.subscriptions.add(
      this.authService.authFailed$.subscribe((err: any) => {
        this.authFailed = err.statusText;
        this.model.password = '';
        this.loading = false;
        this.changeDetectorRef.detectChanges();
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

    this.subscriptions.add(
      this.authService.authFailed$.subscribe((err: any) => {
        // console.log('Auth Failed', err);
        this.zone.run(() => {
          this.authFailed = err.statusText;
          this.model.password = '';
          this.loading = false;
        });
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  async login() {
    const token = await this.recaptchaService.executeReturn('login');
    this.loading = true;
    this.authFailed = '';

    this.subscriptions.add(
      this.authService.login(
        this.model.username,
        this.model.password,
        token,
        this.model.rememberme
      ).pipe(
        tap(() => {
          this.router.navigateByUrl('/sales');
          // (window as any).location = '/';
        }),
        finalize(() => {
          this.loading = false;
        })
      ).subscribe()
    );
  }

}

