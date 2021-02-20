/* eslint-disable import/order */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

/* Modules */
import { AppCommonModule } from '@modules/app-common/app-common.module';
import { NavigationModule } from '@modules/navigation/navigation.module';

/* Components */
import * as eventsRegistrationComponents from './components';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        AppCommonModule,
        NavigationModule,
    ],
    providers: [],
    declarations: [...eventsRegistrationComponents.components],
    exports: [...eventsRegistrationComponents.components],
})
export class EventsRegistrationModule {}
