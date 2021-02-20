/* eslint-disable import/order */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Module */
import { VideoModule } from './video.module';

/* Containers */
import * as videoContainers from './containers/index';

/* Routes */
export const ROUTES: Routes = [
  {
    path: '',
    component: videoContainers.Videop4WayComponent,
  },
  {
    path: 'q',
    component: videoContainers.VideoQueueComponent,
  },
  {
    path: 'player',
    component: videoContainers.Videop4WayComponent,
  },
];

@NgModule({
  imports: [VideoModule, RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class VideoRoutingModule { }
