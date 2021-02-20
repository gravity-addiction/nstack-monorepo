import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-layout-error',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './layout-error.component.html',
    styleUrls: ['layout-error.component.scss'],
})
export class LayoutErrorComponent implements OnInit {
    constructor() {}
    ngOnInit() {}
}
