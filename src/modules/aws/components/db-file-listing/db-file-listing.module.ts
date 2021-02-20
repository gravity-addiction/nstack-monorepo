import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ByteconvertPipeModule } from '@modules/app-common/pipes/byteconvert.pipe';
import { DbFileListingComponent } from './db-file-listing.component';
// import { FileInfoModule } from '../modals/file-info/file-info.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ByteconvertPipeModule,
    // FileInfoModule
  ],
  declarations: [
    DbFileListingComponent
  ],
  exports: [
    DbFileListingComponent
  ]
})
export class DbFileListingModule {}
