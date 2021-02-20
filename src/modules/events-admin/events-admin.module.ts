/* eslint-disable import/order */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

/* Modules */
import { AppCommonModule } from '@modules/app-common/app-common.module';
import { SpinnerComponentModule } from '@modules/app-common/components/spinner/spinner.component';
import { EncodeURIComponentPipeModule } from '@modules/app-common/pipes/index';
import { AwsModule } from '@modules/aws/aws.module';
import { NavigationModule } from '@modules/navigation/navigation.module';
import { VideoModule } from '@modules/video/video.module';

import { QuillModule } from 'ngx-quill';

import { AngularEditorModule } from '@kolkov/angular-editor';

/* Components */
import * as eventsAdminComponents from './components/index';

/* Containers */
import * as eventsAdminContainers from './containers/index';

/* Directives */
import { AuthDirectivesModule } from '@modules/auth/directives/index';

/* Services */
import * as eventsAdminServices from './services/index';

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
        EncodeURIComponentPipeModule,
        QuillModule.forRoot({ modules: { syntax: true } }),
        SpinnerComponentModule,
        VideoModule,
        AngularEditorModule,
    ],
    providers: [...eventsAdminServices.services],
    declarations: [...eventsAdminContainers.containers, ...eventsAdminComponents.components],
    exports: [...eventsAdminContainers.containers, ...eventsAdminComponents.components],
})
export class EventsAdminModule {}
