import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppCommonModule } from '@modules/app-common/app-common.module';
import { ByteconvertPipeModule } from '@modules/app-common/pipes/byteconvert.pipe';
import { AwsModule } from '@modules/aws/aws.module';
import { EventsModule } from '@modules/events/events.module';
import { EventsRegistrationModule } from '@modules/events-registration/events-registration.module';
import { NavigationModule } from '@modules/navigation/navigation.module';
import { VideoModule } from '@modules/video/video.module';

import * as eventsIframeContainers from './containers';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppCommonModule,
    NavigationModule,

    AwsModule,
    ByteconvertPipeModule,
    EventsRegistrationModule,
    EventsModule,
    VideoModule,
  ],
  providers: [],
  declarations: [...eventsIframeContainers.containers],
  exports: [...eventsIframeContainers.containers],
})
export class EventsIframeModule { }
