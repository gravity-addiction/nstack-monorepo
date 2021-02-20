/* eslint-disable import/order */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Module */
import { EventsRegistrationModule } from './events-registration.module';

/* Containers */
import * as eventsRegistrationContainers from './containers/index';

/* Routes */
export const ROUTES: Routes = [
    // {
    //     path: '',
    //     canActivate: [],
    //     component: eventsRegistrationContainers.EventsRegistrationComponent,
    // },
];

@NgModule({
    imports: [EventsRegistrationModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class EventsRegistrationRoutingModule {}
