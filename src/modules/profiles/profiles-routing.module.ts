/* eslint-disable import/order */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Module */
import { ProfilesModule } from './profiles.module';

/* Containers */
import * as profilesContainers from './containers/index';

/* Routes */
export const ROUTES: Routes = [
  {
    path: 'find',
    component: profilesContainers.FindComponent,
  },
  {
    path: ':profile',
    component: profilesContainers.ProfileComponent,
  },
];

@NgModule({
  imports: [ProfilesModule, RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class ProfilesRoutingModule { }
