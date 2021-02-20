import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptFormsModule } from '@nativescript/angular';

import { MonthYearSelectComponent } from './month-year-select.component';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptFormsModule
  ],
  declarations: [
    MonthYearSelectComponent
  ],
  exports: [
    MonthYearSelectComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class MonthYearSelectModule { }
