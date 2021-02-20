/* eslint-disable import/order */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Module */
import { EventsAdminModule } from './events-admin.module';

/* Containers */
import * as eventsAdminContainers from './containers';

/* Routes */
export const ROUTES: Routes = [
  { path: ':event/teams', component: eventsAdminContainers.EventAdminTeamsComponent },
  { path: ':event/website', component: eventsAdminContainers.EventAdminWebsiteComponent },
  { path: ':event', component: eventsAdminContainers.EventAdminComponent },
];

@NgModule({
    imports: [EventsAdminModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class EventsAdminRoutingModule {}
