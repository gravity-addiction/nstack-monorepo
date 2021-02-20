import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { vendorPortalWebsiteRoutes } from './vendor-portal-website.routes';
import { VendorPortalWebsiteModule } from './vendor-portal-website.module';

@NgModule({
  imports: [
    VendorPortalWebsiteModule,
    RouterModule.forChild(vendorPortalWebsiteRoutes)
  ],
  exports: [ RouterModule ]
})
export class VendorPortalWebsiteRoutingModule { }