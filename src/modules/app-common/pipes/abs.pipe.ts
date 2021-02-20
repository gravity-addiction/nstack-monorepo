import { CommonModule } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abs',
})
export class AbsPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    try {
      return Math.abs(value);
    } catch (e) {
      return value;
    }
  }

}

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    AbsPipe,
  ],
  exports: [
    AbsPipe,
  ],
})
export class AbsPipeModule { }
