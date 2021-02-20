/* tslint:disable: ordered-imports*/
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AutosizeModule } from 'ngx-autosize';

/* Modules */
import { AppCommonModule } from '@modules/app-common/app-common.module';
import { IconsModule } from '@modules/icons/icons.module';

import { NavigationModule } from '../navigation/navigation.module';

/* Components */
import * as vpwComponents from './components';

/* Containers */
import * as vpwContainers from './containers';

/* Guards */
import * as vpwGuards from './guards';

/* Services */
import * as vpwServices from './services';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    AutosizeModule,
    AppCommonModule,
    IconsModule,
    NavigationModule,
  ],
  providers: [],
  declarations: [...vpwContainers.containers, ...vpwComponents.components],
  exports: [...vpwContainers.containers, ...vpwComponents.components],
})
export class VendorPortalWebsiteModule {
  static forRoot(): ModuleWithProviders<VendorPortalWebsiteModule> {
    return {
      ngModule: VendorPortalWebsiteModule,
      providers: [
        ...vpwServices.services,
        ...vpwGuards.guards
      ]
    };
  }
}
