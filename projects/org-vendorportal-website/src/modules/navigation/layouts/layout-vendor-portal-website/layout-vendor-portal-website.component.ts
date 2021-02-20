import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-layout-vendor-portal-website',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './layout-vendor-portal-website.component.html',
    styleUrls: ['layout-vendor-portal-website.component.scss'],
})
export class LayoutVendorPortalWebsiteComponent implements OnInit {
    constructor() {}
    ngOnInit() {}
}
