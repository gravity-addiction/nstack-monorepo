import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

/* Modules */
import { AppCommonModule } from '@modules/app-common/app-common.module';
import { SpinnerComponentModule } from '@modules/app-common/components/spinner/spinner.component';
import { AuthDirectivesModule } from '@modules/auth/directives/index';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

/* Components */
import * as navigationComponents from './components/index';

/* Containers */
import * as navigationContainers from './containers/index';

/* Layouts */
import * as appCommonLayouts from './layouts/index';

/* Services */
import * as navigationServices from './services/index';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AppCommonModule,
    ReactiveFormsModule,
    FormsModule,
    AuthDirectivesModule.forRoot(),
    BsDropdownModule.forRoot(),
    SpinnerComponentModule,
  ],
  declarations: [
    ...navigationContainers.containers,
    ...navigationComponents.components,
    ...appCommonLayouts.layouts,
  ],
  exports: [
    ...navigationContainers.containers,
    ...navigationComponents.components,
    ...appCommonLayouts.layouts,
  ],
})
export class NavigationModule {
  constructor(private navServices: navigationServices.NavigationService) {}

  static forRoot(): ModuleWithProviders<NavigationModule> {
    return {
      ngModule: NavigationModule,
      providers: [...navigationServices.services],
    };
  }
}
