/* eslint-disable import/order */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

/* Modules */
import { AppCommonModule } from '@modules/app-common/app-common.module';
// eslint-disable-next-line max-len
import { ByteconvertPipeModule, EncodeURIComponentPipeModule, KeyvaluePipeModule, OrdinalPipeModule } from '@modules/app-common/pipes/index';
import { SpinnerComponentModule } from '@modules/app-common/components/spinner/spinner.component';
import { AuthDirectivesModule } from '@modules/auth/directives/index';
import { AwsModule } from '@modules/aws/aws.module';
import { EventsAdminModule } from '@modules/events-admin/events-admin.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NavigationModule } from '@modules/navigation/navigation.module';
import { VideoModule } from '@modules/video/video.module';

/* Components */
import * as eventsComponents from './components/index';

/* Containers */
import * as eventsContainers from './containers/index';

/* Pipes */
import * as eventsPipes from './pipes/index';

/* Services */
import * as eventsServices from './services/index';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppCommonModule,
    NavigationModule,
    AuthDirectivesModule,
    AwsModule,
    ByteconvertPipeModule,
    EncodeURIComponentPipeModule,
    KeyvaluePipeModule,
    OrdinalPipeModule,
    VideoModule,
    SpinnerComponentModule,
    BsDropdownModule,
    EventsAdminModule,
    ...eventsPipes.modules,
  ],
  declarations: [...eventsContainers.containers, ...eventsComponents.components],
  entryComponents: [ ...eventsComponents.entryComponents ],
  exports: [...eventsContainers.containers, ...eventsComponents.components],
})
export class EventsModule {
  static forRoot(): ModuleWithProviders<EventsModule> {
    return {
      ngModule: EventsModule,
      providers: [...eventsServices.services, ...eventsPipes.pipes],
    };
  }
}
