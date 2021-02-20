import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { vendorPortalWebsiteRoutes } from './vendor-portal-website.routes';
import { VendorPortalWebsiteModule } from './vendor-portal-website.module';

@NgModule({
  imports: [
    VendorPortalWebsiteModule,
    NativeScriptRouterModule.forChild(vendorPortalWebsiteRoutes)
  ],
  exports: [ NativeScriptRouterModule ]
})
export class VendorPortalWebsiteRoutingModule { }