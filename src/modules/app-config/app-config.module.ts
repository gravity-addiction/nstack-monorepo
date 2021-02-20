/* eslint-disable import/order */
import { NgModule, ModuleWithProviders, SecurityContext } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ConfigService } from './config.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ]
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
