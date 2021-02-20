/* eslint-disable import/order */
import { NgModule, ModuleWithProviders, NO_ERRORS_SCHEMA, SecurityContext } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';

import { AuthModule } from '@modules/auth/auth.module';
import { ConfigService } from './config.service';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    AuthModule,
  ],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppConfigModule {
  static forRoot(): ModuleWithProviders<AppConfigModule> {
    return {
      ngModule: AppConfigModule,
      providers: [
        ConfigService
      ],
    };
  }
}

export * from './models/i-config';
