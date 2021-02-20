import { Routes } from '@angular/router';

import * as vpwContainers from './containers';

export const vendorPortalWebsiteRoutes: Routes = [
    {
        path: '',
        component: vpwContainers.HomeComponent,
    },
    {
        path: 'payments/:pay_id',
        component: vpwContainers.PaymentsComponent,
    },
    {
        path: 'payments',
        component: vpwContainers.PaymentsComponent,
    }
];
