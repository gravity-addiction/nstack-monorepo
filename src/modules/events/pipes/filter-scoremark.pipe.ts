import { CommonModule } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterScoremark',
  pure: false,
})
export class FilterScoremarkPipe implements PipeTransform {

  transform(value: any, arg: string): any {
    if (value == null) {
      return [];
    }
    return value.filter((c: any) => c.class === arg);
  }
}


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    FilterScoremarkPipe,
  ],
  exports: [
    FilterScoremarkPipe,
  ],
})
export class FilterScoremarkPipeModule {}
