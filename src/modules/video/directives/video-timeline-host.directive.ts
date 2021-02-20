import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[videoTimelineHost]',
})
export class VideoTimelineHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
