import { CommonModule } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'createDubLink',
  pure: false,
})
export class CreateDubLinkPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) { }

  transform(rnd: string, slug: string, team: any): any {
    let url = '';
    url += 'dub://';
    if (slug) {
 url += encodeURIComponent(slug);
} else {
 url += 'anonymous';
}
    url += '/';
    if (team.teamNumber) {
 url += encodeURIComponent(team.teamNumber);
    } else if (team.name) {
 url += encodeURIComponent(team.number);
}

    url += '/';
    if (rnd) {
 url += encodeURIComponent(rnd);
}

    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    CreateDubLinkPipe,
  ],
  exports: [
    CreateDubLinkPipe,
  ],
})
export class CreateDubLinkPipeModule {}
