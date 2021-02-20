import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouteReuseStrategy } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppCommonModule } from '@modules/app-common/app-common.module';
import { HelperBrowserService } from '@modules/app-common/services/helper-browser.service';
import { IConfig } from '@modules/app-config/app-config.module';
import { ConfigService } from '@modules/app-config/config.service';
import { IconsModule } from '@modules/icons/icons.module';


import { AppComponent } from '@src/app/app.component';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

import { routes } from './app.routes';
import { CacheRouteReuseStrategy } from './cache-route-reuse.strategy';
import { NavigationModule } from '../modules/navigation/navigation.module';
import { VendorPortalWebsiteModule } from '../modules/vendor-portal-website/vendor-portal-website.module';

const configServiceFactory = (configService: ConfigService): (() => Promise<IConfig>) => () => configService.loadConfig({} as IConfig);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),

    FormsModule,
    HttpClientModule,
    AppCommonModule.forRoot(),
    NavigationModule.forRoot(),
    BrowserAnimationsModule,

    BsDropdownModule.forRoot(),
    FontAwesomeModule,
    ModalModule.forRoot(),
    IconsModule,
    ProgressbarModule.forRoot(),

    AppCommonModule.forRoot(),
    VendorPortalWebsiteModule.forRoot()
  ],
  providers: [
    CookieService,
    HelperBrowserService,
    {
      provide: APP_INITIALIZER,
      useFactory: configServiceFactory,
      multi: true,
      deps: [ConfigService],
    },
    { provide: RouteReuseStrategy, useClass: CacheRouteReuseStrategy }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }