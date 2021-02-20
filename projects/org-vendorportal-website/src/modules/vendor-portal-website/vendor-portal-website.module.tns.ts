/* tslint:disable: ordered-imports*/
import { ModuleWithProviders, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptFormsModule, NativeScriptRouterModule } from '@nativescript/angular';

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
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    NativeScriptFormsModule,
    AppCommonModule,
    IconsModule,
    NavigationModule,
  ],
  providers: [...vpwServices.services, ...vpwGuards.guards],
  declarations: [...vpwContainers.containers, ...vpwComponents.components],
  exports: [...vpwContainers.containers, ...vpwComponents.components],
  schemas: [NO_ERRORS_SCHEMA]
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
