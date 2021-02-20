import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[rolePermission]',
})
export class RolePermissionDirective implements OnInit, OnDestroy {
  @Input() rolePermission!: Array<string> | string;
  @Input() roleDeclined: any;

  subscriptions: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private el: ElementRef
  ) { }

  ngOnInit() {
    this.subscriptions.add(this.authService.authRefreshed$.subscribe((userInfo) => this.setupPermission(userInfo)));
    this.setupPermission(this.tokenService.getActiveJson());
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setupPermission(userInfo: any) {
    let checkOk = false;
    const role = userInfo.role || '';
    const roleP = (this.rolePermission && Array.isArray(this.rolePermission)) ?
      this.rolePermission :
      [(this.rolePermission || '')];

    // Check Global
    if (role && roleP.indexOf(role) > -1) {
      checkOk = true;
    }

    if (roleP.length === 0) {
      checkOk = true;
    }

    if (typeof this.roleDeclined === 'function') {
      this.roleDeclined(checkOk);
    } else if (checkOk) {
      this.el.nativeElement.style.display = '';
    } else {
      this.el.nativeElement.style.display = 'none';
    }
  }
}
