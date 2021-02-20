import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MonthYearSelectComponent } from './month-year-select.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    MonthYearSelectComponent
  ],
  exports: [
    MonthYearSelectComponent
  ]
})
export class MonthYearSelectModule { }
