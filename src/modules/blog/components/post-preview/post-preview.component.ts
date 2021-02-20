import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-post-preview',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './post-preview.component.html',
    styleUrls: ['post-preview.component.scss'],
})
export class PostPreviewComponent implements OnInit {
    constructor() {}
    ngOnInit() {}
}
