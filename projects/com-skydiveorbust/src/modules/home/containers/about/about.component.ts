import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-about',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './about.component.html',
    styleUrls: ['about.component.scss'],
})
export class AboutComponent implements OnInit {
    constructor() {}
    ngOnInit() {}
}
