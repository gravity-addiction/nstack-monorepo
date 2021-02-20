import { APP_INITIALIZER, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
// import { RouteReuseStrategy } from '@angular/router';
// eslint-disable-next-line max-len
import { NativeScriptModule, NativeScriptFormsModule, NativeScriptHttpClientModule, NativeScriptRouterModule, registerElement } from '@nativescript/angular';

import { AppCommonModule } from '@modules/app-common/app-common.module';
import { HelperNativescriptService } from '@modules/app-common/services/helper-nativescript.service';
import { IConfig } from '@modules/app-config/app-config.module';
import { ConfigService } from '@modules/app-config/config.service';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from '@src/app/app.component';
import { routes } from './app.routes';

// import { CacheRouteReuseStrategy } from './cache-route-reuse.strategy';
const conf = require('../assets/config.json');

export const configServiceFactory = (configService: ConfigService): (() => Promise<IConfig>) =>
  () => configService.loadConfig(conf as IConfig);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptHttpClientModule,
    NativeScriptRouterModule,
    NativeScriptRouterModule.forRoot(routes),

    FontAwesomeModule,

    AppCommonModule.forRoot(),
    AuthModule.forRoot(),
    UsersModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: configServiceFactory,
      multi: true,
      deps: [ ConfigService ],
    },
    // { provide: RouteReuseStrategy, useClass: CacheRouteReuseStrategy }
    HelperNativescriptService,
  ],
  bootstrap: [ AppComponent ],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }

registerElement('PreviousNextView', () => require('nativescript-iqkeyboardmanager').PreviousNextView);
