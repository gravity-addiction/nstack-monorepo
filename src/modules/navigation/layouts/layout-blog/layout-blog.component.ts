import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-layout-blog',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './layout-blog.component.html',
    styleUrls: ['layout-blog.component.scss'],
})
export class LayoutBlogComponent implements OnInit {
    constructor() {}
    ngOnInit() {}
}
