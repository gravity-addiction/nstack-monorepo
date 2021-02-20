import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-footer',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './footer.component.html',
    styleUrls: ['footer.component.scss'],
})
export class FooterComponent implements OnInit {
    constructor(
      private router: Router
    ) {}

    ngOnInit() {}

    openLogin() {
      this.router.navigateByUrl('/login');
    }
}
