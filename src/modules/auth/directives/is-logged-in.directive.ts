import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[isLoggedIn]',
})
export class IsLoggedInDirective implements OnInit, OnDestroy {
  @Input() isLoggedIn!: boolean;

  subscriptions: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private el: ElementRef
  ) { }

  ngOnInit() {
    this.subscriptions.add(this.authService.authRefreshed$.subscribe((userInfo) => this.setupLogin()));
    this.setupLogin();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setupLogin() {
    this.isLoggedIn = this.tokenService.hasActiveToken();
    if (this.isLoggedIn) {
      this.el.nativeElement.style.display = '';
    } else {
      this.el.nativeElement.style.display = 'none';
    }
  }
}
