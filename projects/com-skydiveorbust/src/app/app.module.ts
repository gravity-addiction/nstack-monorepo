import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouteReuseStrategy } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppCommonModule } from '@modules/app-common/app-common.module';
import { MonthNamePipeModule } from '@modules/app-common/pipes';
import { AuthDirectivesModule } from '@modules/auth/directives';
import { AuthModule } from '@modules/auth/auth.module';
import { AuthInterceptor } from '@modules/auth/auth.interceptor';
import { AwsModule } from '@modules/aws/aws.module';
import { ConfigService } from '@modules/app-config/config.service';
import { BlogModule } from '@modules/blog/blog.module';
import { EventsModule } from '@modules/events/events.module';
import { HelperBrowserService} from '@modules/app-common/services/helper-browser.service';
import { IConfig } from '@modules/app-config/app-config.module';
import { GRecaptchaModule } from '@modules/g-recaptcha/g-recaptcha.module';
import { UsersModule } from '@modules/users/users.module';
import { UserManagementModule } from '@modules/users-management/user-management.module';
import { VideoModule } from '@modules/video/video.module';

import { AppComponent } from '@src/app/app.component';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CookieService } from 'ngx-cookie-service';
import { DndModule } from 'ngx-drag-drop';
import { NgxDraggableDomModule } from 'ngx-draggable-dom';

import { routes } from './app.routes';
import { CacheRouteReuseStrategy } from './cache-route-reuse.strategy';
import { HomeModule } from '../modules/home/home.module';
import { NavigationModule } from '../modules/navigation/navigation.module';

const configServiceFactory = (configService: ConfigService): (() => Promise<IConfig>) => () => configService.loadConfig({} as IConfig);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),

    HttpClientModule,
    FormsModule,
    HomeModule.forRoot(),
    NavigationModule.forRoot(),
    BrowserAnimationsModule,

    FontAwesomeModule,
    MonthNamePipeModule,

    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),

    AppCommonModule.forRoot(),
    AuthModule.forRoot(),
    AwsModule.forRoot(),
    BlogModule,
    GRecaptchaModule.forRoot(),
    UsersModule.forRoot(),
    UserManagementModule,

    ProgressbarModule.forRoot(),
    AuthDirectivesModule.forRoot(),
    EventsModule.forRoot(),
    VideoModule.forRoot(),
    DndModule,
    NgxDraggableDomModule,
  ],
  providers: [
    CookieService,
    HelperBrowserService,
    {
      provide: APP_INITIALIZER,
      useFactory: configServiceFactory,
      multi: true,
      deps: [ ConfigService ],
    },
    { provide: RouteReuseStrategy, useClass: CacheRouteReuseStrategy }
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
