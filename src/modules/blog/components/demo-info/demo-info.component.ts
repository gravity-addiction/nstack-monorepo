import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-demo-info',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './demo-info.component.html',
    styleUrls: ['demo-info.component.scss'],
})
export class DemoInfoComponent implements OnInit {
    constructor() {}
    ngOnInit() {}
}
