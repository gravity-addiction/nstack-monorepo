import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCommonModule } from '@modules/app-common/app-common.module';
import { DndModule } from 'ngx-drag-drop';
import { NgxDraggableDomModule } from 'ngx-draggable-dom';

/* Components */
import * as PdfWysiwygComponentsModule from './components';
/* Directives */
import { PdfWysiwygDirectivesModule } from './directives';
/* Services */
import * as PdfWysiwygServices from './services';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppCommonModule,
    PdfWysiwygDirectivesModule.forRoot(),
    DndModule,
    NgxDraggableDomModule,
  ],
  declarations: [...PdfWysiwygComponentsModule.components],
  exports: [...PdfWysiwygComponentsModule.components],
})
export class PdfWysiwygModule {
  static forRoot(): ModuleWithProviders<PdfWysiwygModule> {
    return {
      ngModule: PdfWysiwygModule,
      providers: [...PdfWysiwygServices.services],
    };
  }
}
