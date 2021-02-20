/* eslint-disable import/order */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Module */
import { AwsModule } from './aws.module';

/* Containers */
import * as awsContainers from './containers';

/* Routes */
export const ROUTES: Routes = [
  {
    path: '',
    component: awsContainers.AwsAdminMainComponent,
  },
];

@NgModule({
    imports: [AwsModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class AwsRoutingModule {}
