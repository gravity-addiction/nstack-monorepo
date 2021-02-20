/* eslint-disable import/order */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

/* Modules */
import { AppCommonModule } from '@modules/app-common/app-common.module';
import { SpinnerComponentModule } from '@modules/app-common/components/spinner/spinner.component';
import { NavigationModule } from '@modules/navigation/navigation.module';
import { RecordsProfileModule } from '@modules/records/components/records-profile-a/records-profile.module';

/* Containers */
import * as profilesContainers from './containers/index';

/* Services */
import * as profilesServices from './services/index';

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

    RecordsProfileModule,
  ],
  providers: [...profilesServices.services],
  declarations: [...profilesContainers.containers],
  exports: [...profilesContainers.containers],
})
export class ProfilesModule { }
