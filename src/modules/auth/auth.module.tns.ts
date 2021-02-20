import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NativeScriptCommonModule, NativeScriptFormsModule, NativeScriptRouterModule } from '@nativescript/angular';


/* Directives */
import * as authDirectives from './directives';

/* Guards */
import * as authGuards from './guards';

/* Services */
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';

/* Interceptors */
import { AuthInterceptor } from './auth.interceptor';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule,
    authDirectives.AuthDirectivesModule.forRoot()
  ]
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
          deps: [ AuthService, TokenService ]
        }
      ],
    };
  }
}
