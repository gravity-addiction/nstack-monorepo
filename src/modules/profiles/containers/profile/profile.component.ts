import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ActionCtrlService } from '@modules/app-common/services/index';
import { ProfileService } from '@modules/profiles/services/index';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { ResultsProfile } from '@typings/profile';

@Component({
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile.component.html',
  styleUrls: ['profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  // subscriptions: Subscription = new Subscription();
  profile$!: Observable<ResultsProfile | null>;
  profile!: string;

  loading = true;

  constructor(
    public actionCtrl: ActionCtrlService,
    private changeDetectorRef: ChangeDetectorRef,
    private profileService: ProfileService,
    private route: ActivatedRoute
  ) {
    this.actionCtrl.lockLoading = true;
  }

  ngOnInit() {
    this.loading = true;

    this.profile$ = this.route.paramMap.pipe(
      tap((params: ParamMap) => (this.profile = (params.get('profile') as string).replace(' ', '_'))),
      switchMap((_params: ParamMap) => this.profileService.getProfile$(this.profile)),
      tap(() => {
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      })
    );
  }

  ngOnDestroy() {
    //    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() {
    this.actionCtrl.navLoading = false;
    this.actionCtrl.lockLoading = false;
  }
}
