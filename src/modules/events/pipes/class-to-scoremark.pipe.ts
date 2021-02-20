import { CommonModule } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'classToScoremark',
})
export class ClassToScoremarkPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value === 'point') {
      return '/';
    } else if (value === 'bust') {
      return '-';
    } else if (value === 'omit') {
      return 'O';
    } else if (value === 'nv') {
      return 'NV';
    }
    return '?';
  }
}


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ClassToScoremarkPipe,
  ],
  exports: [
    ClassToScoremarkPipe,
  ],
})
export class ClassToScoremarkPipeModule {}
