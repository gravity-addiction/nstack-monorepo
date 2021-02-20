import { Injectable } from '@angular/core';
import { HttpClient, HttpXsrfTokenExtractor } from '@angular/common/http';

import { AuthService } from '@modules/auth/services/auth.service';
import { TokenService } from '@modules/auth/services/token.service';
import { ConfigService } from '@modules/app-config/config.service';

import { Subscription, BehaviorSubject } from 'rxjs';

import { IUser, INewUser } from '../models/i-user';

@Injectable()
export class UserService {
  public roleSource = new BehaviorSubject({});
  public roleRefreshed$ = this.roleSource.asObservable();

  private authSubscription: Subscription;

  constructor(private http: HttpClient,
    private authService: AuthService,
    private configService: ConfigService,
    private tokenService: TokenService) {

    this.authSubscription = this.authService.authRefreshed$.subscribe((login) => {
      if (login && login.id) {
        this.getRoles(login.id);
      }
    });
  }

  getAll() {
    return this.http.get<IUser[]>(this.configService.apiPath + '/users', {
      headers: Object.assign({}, this.configService.httpJsonHeader(), this.authService.httpAuthHeader(this.tokenService.getActiveToken()))
    });
  }

  getById(id: number) {
    return this.http.get(this.configService.apiPath + '/users/' + encodeURIComponent((id || '').toString()), {
      headers: this.configService.httpJsonHeader(this.authService.httpAuthHeader(this.tokenService.getActiveToken()))
    });
  }

  getRoles(id: number) {
    this.http.get(this.configService.apiPath + '/users/' + encodeURIComponent((id || '').toString()) + '/roles', {
      headers: this.configService.httpJsonHeader(this.authService.httpAuthHeader(this.tokenService.getActiveToken()))
    }).subscribe(resp => {
      this.roleSource.next(resp);
    });
  }

  create(user: Partial<INewUser>) {
    return this.http.post(this.configService.apiPath + '/users', user, {
      headers: this.configService.httpJsonHeader(this.authService.httpAuthHeader(this.tokenService.getActiveToken()))
    });
  }

  update(user: IUser) {
    return this.http.put(this.configService.apiPath + '/users/' + encodeURIComponent(((user || {}).id || '').toString()), user, {
      headers: this.configService.httpJsonHeader(this.authService.httpAuthHeader(this.tokenService.getActiveToken()))
    });
  }

  delete(id: number) {
    return this.http.delete(this.configService.apiPath + '/users/' + encodeURIComponent(id.toString()), {
      headers: this.configService.httpJsonHeader(this.authService.httpAuthHeader(this.tokenService.getActiveToken()))
    });
  }

  password(user, oldpassword: string, newpassword: string) {
    user.password = newpassword;
    user.oldpassword = oldpassword;
    return this.http.put(this.configService.apiPath + '/users/' + encodeURIComponent(((user || {}).id || '').toString()) + '/password',
      user,
      {
        headers: this.configService.httpJsonHeader(this.authService.httpAuthHeader(this.tokenService.getActiveToken()))
      }
    );
  }

  resetPassword(userId) {
    return this.http.get(this.configService.apiPath + '/users/' + encodeURIComponent((userId || '').toString()) + '/resetpassword', {
      headers: this.configService.httpJsonHeader(this.authService.httpAuthHeader(this.tokenService.getActiveToken()))
    });
  }
}
