
import { ModuleWithProviders, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptFormsModule, NativeScriptRouterModule } from '@nativescript/angular';
import { AppCommonModule } from '@modules/app-common/app-common.module';
// import { NavigationModule } from '../navigation/navigation.module';

/* Containers */
import { containers } from './containers/index';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule,

    AppCommonModule,
  ],
  declarations: [...containers],
  exports: [...containers],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class HomeModule {
  static forRoot(): ModuleWithProviders<HomeModule> {
    return {
      ngModule: HomeModule,
      providers: [ ],
    };
  }
}
