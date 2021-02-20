import { CommonModule } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';

// Original code from: https://gist.github.com/JonCatmull/ordinal.pipe.ts

const ordinals: string[] = ['th', 'st', 'nd', 'rd'];

/*
  value | ordinal:keepNumber

  Example:
  {{ 23 | ordinal }}
  {{ 23 | ordinal: false }}
*/
@Pipe({
  name: 'ordinal',
})
export class OrdinalPipe implements PipeTransform {
  transform(value: number, keepNumber: boolean = true): any {
    const v = value % 100;
    return (keepNumber ? value : '') + (ordinals[(v - 20) % 10] || ordinals[v] || ordinals[0]);
  }

}

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    OrdinalPipe,
  ],
  exports: [
    OrdinalPipe,
  ],
})
export class OrdinalPipeModule { }
