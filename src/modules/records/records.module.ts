/* eslint-disable import/order */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

/* Modules */
import { AppCommonModule } from '@modules/app-common/app-common.module';
import { AuthModule } from '@modules/auth/auth.module';
import { SpinnerComponentModule } from '@modules/app-common/components/spinner/spinner.component';
import { NavigationModule } from '@modules/navigation/navigation.module';
import { RecordsServiceModule } from '@modules/records/services/index';

/* Components */
import * as recordsComponents from './components/index';

/* Containers */
import * as recordsContainers from './containers/index';

/* Pipes */
import * as recordsPipes from './pipes/index';

/* Services */
import * as recordsServices from './services/index';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppCommonModule,
    NavigationModule,
    SpinnerComponentModule,

    AuthModule,
    RecordsServiceModule,
  ],
  providers: [...recordsServices.services],
  declarations: [
    ...recordsPipes.pipes,
    ...recordsContainers.containers,
    ...recordsComponents.components,
  ],
  exports: [...recordsContainers.containers, ...recordsComponents.components],
})
export class RecordsModule { }
