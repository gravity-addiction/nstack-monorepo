import { ModuleWithProviders, NgModule } from '@angular/core';

import { IsLoggedInDirective } from './is-logged-in.directive';
import { RolePermissionDirective } from './role-permission.directive';

const directives = [IsLoggedInDirective, RolePermissionDirective];

export * from './is-logged-in.directive';
export * from './role-permission.directive';

@NgModule({
  declarations: [...directives],
  exports: [...directives],
})
export class AuthDirectivesModule {
  constructor() { }

  static forRoot(): ModuleWithProviders<AuthDirectivesModule> {
    return {
      ngModule: AuthDirectivesModule,
    };
  }
}
