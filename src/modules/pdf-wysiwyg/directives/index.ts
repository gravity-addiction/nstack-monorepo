import { ModuleWithProviders, NgModule } from '@angular/core';

import { DraggableDirective } from './draggable.directive';

const directives = [DraggableDirective];

export * from './draggable.directive';

@NgModule({
  declarations: [...directives],
  exports: [...directives],
})
export class PdfWysiwygDirectivesModule {
  constructor() {}

  static forRoot(): ModuleWithProviders<PdfWysiwygDirectivesModule> {
    return {
      ngModule: PdfWysiwygDirectivesModule,
    };
  }
}
