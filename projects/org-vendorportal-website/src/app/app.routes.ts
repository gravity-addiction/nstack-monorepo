import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '',
    loadChildren: () => import('../modules/vendor-portal-website/vendor-portal-website-routing.module').then(
      m => m.VendorPortalWebsiteRoutingModule
    ),
  },
  { path: '**', redirectTo: '/sales' }
];
