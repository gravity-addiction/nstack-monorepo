/* eslint-disable import/order */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

/* Directives */
import * as authDirectives from './directives';

/* Guards */
import * as authGuards from './guards';

/* Services */
import { AuthService } from './services/auth.service';

/* Interceptors */
import { AuthInterceptor } from './auth.interceptor';
import { TokenService } from './services/token.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    authDirectives.AuthDirectivesModule.forRoot()
  ],
  // providers: [...authServices.services, ...authGuards.guards]
})
export class AuthModule {
  static forRoot(): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        AuthService,
        TokenService,
        ...authGuards.guards,
        {
          provide: HTTP_INTERCEPTORS,
          useFactory: (authService: AuthService, tokenService: TokenService) => new AuthInterceptor(authService, tokenService),
          multi: true,
          deps: [AuthService, TokenService],
        },
      ],
    };
  }
}
