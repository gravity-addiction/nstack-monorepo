import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as userComponents from './components/index';

import { UsersModule } from './users.module';

/* Routes */
export const usersRoutes: Routes = [
  { path: '', component: userComponents.LoginComponent },
  { path: 'login', component: userComponents.LoginComponent },
  { path: 'logout', component: userComponents.LogoutComponent },
  { path: 'refresh', component: userComponents.LoginComponent },
  //  { path: 'register', component: userComponents.RegisterComponent },
  { path: 'changepassword', component: userComponents.ChangePasswordComponent }
];

@NgModule({
  imports: [UsersModule, RouterModule.forChild(usersRoutes)],
  exports: [RouterModule],
})
export class UsersRoutingModule { }



