// eslint-disable-next-line max-len
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, OnDestroy, NgZone, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { action, ActionOptions, Device, ObservableArray, Page, isAndroid, TextField } from '@nativescript/core';
import { ad } from '@nativescript/core/utils';

import { ConfigService } from '@modules/app-config/config.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { HelperService } from '@modules/app-common/services/helper-scripts.service';
import { PushService } from '@modules/app-common/services/push.service';
import { ScreenService } from '@modules/app-common/services/screen.service';
import { TokenService } from '@modules/auth/services/token.service';
import { UserService } from '@modules/users-shared/services/user.service';

import { BehaviorSubject, Subscription, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-login-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tfStore', { static: false }) tfStore: ElementRef<TextField>;
  @ViewChild('tfUsername', { static: false }) tfUsername: ElementRef<TextField>;
  subscriptions: Subscription = new Subscription();

  model: any = {
    username: '',
    password: '',
    store: '',
    rememberme: true
  };
  loading = false;
  returnUrl!: string;
  gotCallback = false;
  loginAttempted = false;
  loginForm!: any;
  showIdent!: string;
  public usernameKB = 'number';

  public authFailed = '';
  public loginTokens: any[] = [];
  public storeList$ = new BehaviorSubject<string[] | null>(null);
  public storeArr = ['GVM', 'Ourplace', 'FamousJoes', 'GNW', 'Victors'];

  constructor(
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private configService: ConfigService,
    private router: RouterExtensions,
    private authService: AuthService,
    private page: Page,
    private pushService: PushService,
    private helperService: HelperService,
    public screenService: ScreenService,
    public tokenService: TokenService,
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
        setTimeout(() => {
          this.authFailed = '';
          this.changeDetectorRef.detectChanges();
        }, 2200);
      })
    );
  }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.subscriptions.add(
      this.screenService.screenChanged.pipe(
        tap((_orientation: string) => {
          // console.log(this.screenService.screenOrientation)
          this.changeDetectorRef.detectChanges();
        })
      ).subscribe()
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() {

  }

  async login() {

    this.authFailed = '';

    // console.log('TT', this.configService.config);
    // console.log('HH', (this.configService.config.apiServer || '').toString() + (this.configService.config.apiPath || '').toString());

//    this..apiPath = 'http://10.0.2.2:3020/api';
//    this.configService.apiServer = 'http://192.168.126.51:3020';

    const mPass = this.model.password;
    const mUser = this.model.username;
    if (!mUser || !mPass) {
      return;
    }

    this.loading = true;
    const apiPath = this.configService.customApiPath(`https://${encodeURIComponent((this.model.store || '').trim())}.vendorportal.org`);
    const rememberMe = this.model.rememberme;
    this.model.password = '';
    // this.subscriptions.add(
      this.authService.login(
        mUser,
        mPass,
        'mobileapp',
        rememberMe,
        apiPath
      ).subscribe(() => {
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      });
    // );

  }

  changeKeyboardStyle(kbType: string) {
    this.tfUsername.nativeElement.dismissSoftInput();
    this.usernameKB = kbType;
    this.changeDetectorRef.detectChanges();
    this.tfUsername.nativeElement.focus();
  }

  loginToken(tokenInfo) {
    if (this.tokenService.notExpired(tokenInfo)) {
      this.tokenService.setActiveIdent(tokenInfo.ident);
    }
  }

  identHeaderClick(tokenInfo) {
    if (tokenInfo.ident === this.showIdent) {
      this.showIdent = '';
      this.tokenService.setActiveIdent(null);
    } else {
      this.showIdent = tokenInfo.ident || '';
      this.tokenService.setActiveIdent(tokenInfo.ident);
    }
  }

  identPushChanged(tokenInfo, active = true) {
    tokenInfo.pushing = null;
    if (active) {
      /*
      this.vendorService.updateFCM(
        Device.uuid, this.pushService.token,
        { deviceType: Device.deviceType, os: Device.os, uuid: Device.uuid, language: Device.language }
      ).pipe(
        tap((resp) => {
          tokenInfo.pushing = true;
          this.changeDetectorRef.detectChanges();
        }),
        catchError((err) => {
          tokenInfo.pushing = false;
          this.changeDetectorRef.detectChanges();
          return throwError(err);
        })
      ).subscribe();
      */
    } else {
      /*
      this.vendorService.deleteFCM(Device.uuid).subscribe((resp) => {
        tokenInfo.pushing = false;
        this.changeDetectorRef.detectChanges();
      });
      */
    }
  }

  // NS Functions
  stopLogin() {
    // console.log('Need to implement the stopping of login')
  }

  cleanToken(tokenInfo) {
    // console.log('Clean', tokenInfo);
    if (tokenInfo.hasOwnProperty('ident') && tokenInfo.ident !== null) {

      // console.log(`https://${encodeURIComponent((tokenInfo.store || '').trim())}.vendorportal.org${this.configService.config.apiPath}`);
      this.authService.removeServerToken(
        `https://${encodeURIComponent((tokenInfo.store || '').trim())}.vendorportal.org${this.configService.config.apiPath}`,
        this.tokenService.getTokenByIdent(tokenInfo.ident)
      );
      this.tokenService.removeToken(tokenInfo.ident);
      // this.authService.deleteLogout();
    }
    this.tokenService.updateAuthCollection();
    this.changeDetectorRef.detectChanges();
  }



  tfStoreTxtChanged(event) {
    const txt = event.value || '';
    // console.log('Txt Changed', event.value);

    if (!event.value) {
      this.storeList$.next([]);
    } else {
      const newList = this.storeArr.filter((store: string) =>
        store.toString().toLowerCase().indexOf((event.value || '').toString().toLowerCase()) > -1
      );
      this.storeList$.next(newList);
    }
  }

  tfStoreTxtSelected(event, txt) {
    this.model.store = txt;
    setTimeout(() => {
 this.storeList$.next(null);
}, 100);
    this.tfUsername.nativeElement.focus();
  }


  tsStoreLayoutChanged(event) {
    /*
    const autoCompleteTextView = event.object;
    if (autoCompleteTextView.android) {
        autoCompleteTextView.android.getTextField().requestFocus();
        ad.showSoftInput(autoCompleteTextView.android.getTextField());
    } else {
        autoCompleteTextView.ios.textField.becomeFirstResponder();
    }
    */
  }

}

