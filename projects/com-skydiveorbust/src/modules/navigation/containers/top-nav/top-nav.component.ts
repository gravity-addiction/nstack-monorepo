import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '@modules/navigation/services/index';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-top-nav',
    templateUrl: './top-nav.component.html',
    styleUrls: ['top-nav.component.scss'],
})
export class TopNavComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  isOnPost = false;
  isMenuCollapsed = true;

  constructor(
    private navigationService: NavigationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.navigationService.currentComponent$().subscribe(currentComponentName => {
        this.isOnPost = currentComponentName === 'PostComponent';
      })
    );

    // this.authService.checkToken();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openLogin() {
    this.router.navigateByUrl('/login');
  }

  editPost() {
    this.router.navigateByUrl(`/edit/${this.route.snapshot.params.post}`);
  }
}
