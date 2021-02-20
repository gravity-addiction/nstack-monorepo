import { Routes } from '@angular/router';

import { ListUsersComponent } from './components/list-users/list-users.component';
import { ShowUserComponent } from './components/show-user/show-user.component';

export const userManagementRoutes: Routes = [
  { path: '', component: ListUsersComponent },
  { path: ':id', component: ShowUserComponent }
];
