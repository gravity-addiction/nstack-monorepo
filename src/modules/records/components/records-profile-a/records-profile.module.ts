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

/* Components */
import { RecordsProfileAComponent } from './records-profile-a.component';

/* Services */
import { RecordsServiceModule } from '../../services/index';

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

    RecordsServiceModule,
  ],
  declarations: [RecordsProfileAComponent],
  exports: [RecordsProfileAComponent],
})
export class RecordsProfileModule { }
