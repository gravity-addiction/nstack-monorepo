import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListUsersComponent } from './components/list-users/list-users.component';
import { ShowUserComponent } from './components/show-user/show-user.component';

import { UsersManagementModule } from './users-management.module';

export const usersManagementRoutes: Routes = [
  { path: '', component: ListUsersComponent },
  { path: ':id', component: ShowUserComponent }
];

@NgModule({
  imports: [UsersManagementModule, RouterModule.forChild(usersManagementRoutes)],
  exports: [RouterModule],
})
export class UsersManagementRoutingModule { }
