import { CommonModule } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inchesToFeet',
})
export class InchesToFeetPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return String(`${Math.floor(value / 12)}\'${(value % 12)}"`);
  }

}

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    InchesToFeetPipe,
  ],
  exports: [
    InchesToFeetPipe,
  ],
})
export class InchesToFeetPipeModule { }
