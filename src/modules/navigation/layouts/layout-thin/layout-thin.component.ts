import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-layout-thin',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './layout-thin.component.html',
    styleUrls: ['layout-thin.component.scss'],
})
export class LayoutThinComponent implements OnInit {
    constructor() {}
    ngOnInit() {}
}
