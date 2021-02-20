/* eslint-disable import/order */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Module */
import { EventsIframeModule } from './events-iframe.module';

/* Containers */
import * as eventsIframeContainers from './containers/index';

/* Guards */
// import * as eventsIframeGuards from './guards/index';

/* Routes */
export const ROUTES: Routes = [
  { path: ':event', component: eventsIframeContainers.EventIframeComponent },
  { path: ':event/v', component: eventsIframeContainers.EventVideosIframeComponent },
  { path: ':event/s', component: eventsIframeContainers.EventScoresIframeComponent },
  { path: ':event/:shortcode', component: eventsIframeContainers.EventIframeComponent },
  { path: ':event/:shortcode/v', component: eventsIframeContainers.EventVideosIframeComponent },
];

@NgModule({
  imports: [EventsIframeModule, RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class EventsIframeRoutingModule { }
