import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';

@Pipe({
  name: 'monthName'
})
export class MonthNamePipe implements PipeTransform {
  private monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  transform(value: number, args?: any): any {
    if (args === 'short') {
      return this.monthNames[value - 1].substr(0, 3);
    } else {
      return this.monthNames[value - 1];
    }
  }
}

@Pipe({
  name: 'monthNumber'
})
export class MonthNumberPipe implements PipeTransform {
  private monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  transform(value: string, args?: any): any {
    const monLen = this.monthNames.length;
    for (let m = 0; m < monLen; m++) {
      if (args === 'short' && (this.monthNames[m].substr(0, 3) || '').toLowerCase() === (value || '').toLowerCase()) {
        return m + 1;
      } else if ((this.monthNames[m] || '').toLowerCase() === (value || '').toLowerCase()) {
        return m + 1;
      }
    }
  }
}

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    MonthNamePipe,
    MonthNumberPipe
  ],
  exports: [
    MonthNamePipe,
    MonthNumberPipe
  ]
})
export class MonthNamePipeModule { }
