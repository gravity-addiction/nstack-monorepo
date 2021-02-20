import { CommonModule } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'bypassTrustUrl',
})
export class BypassTrustUrlPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) { }

  transform(str: string): any {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(str);
  }
}

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    BypassTrustUrlPipe,
  ],
  exports: [
    BypassTrustUrlPipe,
  ],
})
export class BypassTrustUrlPipeModule { }
