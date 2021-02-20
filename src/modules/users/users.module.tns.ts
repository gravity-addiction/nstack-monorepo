import { ModuleWithProviders, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptFormsModule, NativeScriptRouterModule } from '@nativescript/angular';
import { UserService } from '@modules/users-shared/services/user.service';

import * as userComponents from './components/index';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule,
  ],
  declarations: [...userComponents.components],
  exports: [...userComponents.components],
  schemas: [NO_ERRORS_SCHEMA]
})
export class UsersModule {
  static forRoot(): ModuleWithProviders<UsersModule> {
    return {
      ngModule: UsersModule,
      providers: [
        UserService
      ]
    };
  }
}
