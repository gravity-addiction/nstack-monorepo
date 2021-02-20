/* eslint-disable import/order */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Module */
import { AuthModule } from '@modules/auth/auth.module';
import { RecordsModule } from './records.module';

/* Containers */
import * as recordsContainers from './containers/index';

/* Guards */
import * as authGuards from '@modules/auth/guards/index';

/* Routes */
export const ROUTES: Routes = [
  {
    path: '',
    component: recordsContainers.HomeComponent,
  },
  {
    path: 'admin',
    canActivate: [authGuards.AuthGuard],
    component: recordsContainers.AdminComponent,
  },
  {
    path: ':state',
    component: recordsContainers.HomeComponent,
  },
];

@NgModule({
  imports: [
    RecordsModule,
    AuthModule.forRoot(),
    RouterModule.forChild(ROUTES)
  ],
  exports: [RouterModule],
})
export class RecordsRoutingModule { }
