/* eslint-disable import/order */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Modules */
/* Components */
/* Containers */
/* Guards */
/* Pipes */
/* Services */
import { RecordsService } from './records.service';
import { RecordsAdminService } from './records-admin.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    RecordsService,
    RecordsAdminService
  ],
})
export class RecordsServiceModule { }
