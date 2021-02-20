/* eslint-disable import/order */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Module */
import { EventsModule } from './events.module';

/* Containers */
import * as eventsContainers from './containers/index';

/* Guards */
import { AuthGuard } from '@modules/auth/guards/index';
// import * as eventsGuards from './guards/index';

/* Routes */
export const ROUTES: Routes = [
  { path: '', component: eventsContainers.HomeComponent },
  { path: ':event', component: eventsContainers.EventComponent },
  { path: ':event/judging', component: eventsContainers.EventJudgingComponent, canActivate: [AuthGuard] },
  { path: ':event/:shortcode', component: eventsContainers.EventComponent },
];

@NgModule({
  imports: [EventsModule, RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}
