import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ListUsersComponent } from './components/list-users/list-users.component';
import { ShowUserComponent } from './components/show-user/show-user.component';
import { UserInfoComponent } from './components/user-info/user-info.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [
    ListUsersComponent,
    ShowUserComponent,
    UserInfoComponent
  ],
  exports: [
    UserInfoComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class UserManagementModule { }
