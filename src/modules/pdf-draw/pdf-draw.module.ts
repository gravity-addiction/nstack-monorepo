/* eslint-disable import/order */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

/* Modules */
import { AppCommonModule } from '@modules/app-common/app-common.module';
import { NavigationModule } from '@modules/navigation/navigation.module';
import { PdfWysiwygModule } from '@modules/pdf-wysiwyg/pdf-wysiwyg.module';
import { DndModule } from 'ngx-drag-drop';

/* Components */
import * as pdfDrawComponents from './components/index';

/* Containers */
import * as pdfDrawContainers from './containers/index';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppCommonModule,
    NavigationModule,
    PdfWysiwygModule.forRoot(),
    DndModule,
  ],
  providers: [],
  declarations: [...pdfDrawContainers.containers, ...pdfDrawComponents.components],
  exports: [...pdfDrawContainers.containers, ...pdfDrawComponents.components],
})
export class PdfDrawModule { }
