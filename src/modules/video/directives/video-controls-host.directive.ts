import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[videoControlsStartHost]',
})
export class VideoControlsStartHostDirective {
    constructor(public viewContainerRef: ViewContainerRef) {}
}

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[videoControlsEndHost]',
})
export class VideoControlsEndHostDirective {
    constructor(public viewContainerRef: ViewContainerRef) {}
}
