import { CommonModule } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyvalue',
})
export class KeyvaluePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    const keys = [];
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        keys.push({ key, value: value[key] });
      }
    }
    return keys;
  }
}

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    KeyvaluePipe,
  ],
  exports: [
    KeyvaluePipe,
  ],
})
export class KeyvaluePipeModule { }
