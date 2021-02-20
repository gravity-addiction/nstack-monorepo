import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { UserService } from '@modules/users-shared/services/user.service';

import * as userComponents from './components/index';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
  ],
  declarations: [...userComponents.components],
  exports: [...userComponents.components]
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
