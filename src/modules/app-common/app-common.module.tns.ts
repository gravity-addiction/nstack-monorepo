/* eslint-disable import/order */
import { NgModule, ModuleWithProviders, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptFormsModule, NativeScriptRouterModule } from '@nativescript/angular';
import { DatePipe, DecimalPipe } from '@angular/common';

/* Third Party */
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IconsModule } from '@src/modules/icons/icons.module';

const thirdParty = [ IconsModule, NgbModule ];
const otherProviders = [ DatePipe, DecimalPipe ];

/* Pipes */
import * as appCommonPipes from './pipes';

/* Services */
import * as appCommonServices from './services';


@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule,
    ...thirdParty,
    ...appCommonPipes.modules,
  ],
  exports: [...thirdParty],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppCommonModule {
  static forRoot(): ModuleWithProviders<AppCommonModule> {
    return {
      ngModule: AppCommonModule,
      providers: [
        ...appCommonServices.services,
        ...appCommonPipes.pipes,
        ...otherProviders,
      ],
    };
  }
}


