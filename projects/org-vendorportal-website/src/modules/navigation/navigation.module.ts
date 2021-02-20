/* tslint:disable: ordered-imports*/
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

/* Modules */
import { AppCommonModule } from '@modules/app-common/app-common.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

/* Containers */
import * as navigationContainers from './containers';

/* Layouts */
import * as appLayouts from './layouts';

/* Services */
import * as navigationServices from '@modules/navigation/services/index';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AppCommonModule,
    ReactiveFormsModule,
    FormsModule,
    BsDropdownModule,
  ],
  declarations: [
    ...navigationContainers.containers,
    ...appLayouts.layouts,
  ],
  exports: [
    ...navigationContainers.containers,
    ...appLayouts.layouts,
  ],
})
export class NavigationModule {
  constructor() {}

  static forRoot(): ModuleWithProviders<NavigationModule> {
    return {
      ngModule: NavigationModule,
      providers: [...navigationServices.services],
    };
  }
}
