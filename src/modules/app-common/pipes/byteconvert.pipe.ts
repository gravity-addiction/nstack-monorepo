import { CommonModule } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'byteconvert',
})
export class ByteconvertPipe implements PipeTransform {

  transform(bytes: any, decimals: number): any {
    if (bytes === 0) {
      return '0 B';
    }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ByteconvertPipe,
  ],
  exports: [
    ByteconvertPipe,
  ],
})
export class ByteconvertPipeModule { }
