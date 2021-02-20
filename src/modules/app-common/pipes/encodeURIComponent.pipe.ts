import { CommonModule } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'encodeURIComponent',
})
export class EncodeURIComponentPipe implements PipeTransform {

  transform(str: string): any {
    return encodeURIComponent(str);
  }
}

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    EncodeURIComponentPipe,
  ],
  exports: [
    EncodeURIComponentPipe,
  ],
})
export class EncodeURIComponentPipeModule { }
