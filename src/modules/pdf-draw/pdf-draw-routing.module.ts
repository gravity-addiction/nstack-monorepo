/* eslint-disable import/order */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Module */
import { PdfDrawModule } from './pdf-draw.module';

/* Containers */
import * as pdfDrawContainers from './containers/index';


/* Routes */
export const ROUTES: Routes = [
  {
    path: '',
    component: pdfDrawContainers.PdfEditorComponent,
  },
];

@NgModule({
  imports: [PdfDrawModule, RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class PdfDrawRoutingModule { }
