/* eslint-disable import/order */
import { NgModule, ModuleWithProviders } from '@angular/core';

import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

/* Third Party */
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IconsModule } from '@modules/icons/icons.module';

const thirdParty = [ IconsModule, NgbModule ];
const otherProviders = [ DatePipe, DecimalPipe ];

/* Components */
import { SpinnerComponentModule } from './components';

/* Components */
import * as appCommonDirectives from './directives';

/* Pipes */
import * as appCommonPipes from './pipes';

/* Services */
import * as appCommonServices from './services';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ...thirdParty,
    ...appCommonPipes.modules,
    SpinnerComponentModule,
  ],
  declarations: [...appCommonDirectives.directives],
  exports: [
    ...appCommonDirectives.directives,
    ...thirdParty
  ],
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
