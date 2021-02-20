import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ActionCtrlService, HelperService } from '@modules/app-common/services/index';
import { S3UploadService } from '@modules/aws/services/index';
import { EventsService } from '@modules/events/services/index';
import { Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { EventAdminPageService, EventAdminService } from '../../services/index';

@Component({
  selector: 'app-event-admin-teams',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-admin-teams.component.html',
  styleUrls: ['event-admin-teams.component.scss'],
})
export class EventAdminTeamsComponent implements OnInit, OnDestroy, AfterViewInit {
  subscriptions: Subscription = new Subscription();
  loading = true;

  eventSlug!: string;
  eventData!: any;

  constructor(
    public actionCtrl: ActionCtrlService,
    private eventAdminService: EventAdminService,
    public eapService: EventAdminPageService,
    private eventService: EventsService,
    private helperService: HelperService,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    public s3UploadService: S3UploadService
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.route.paramMap.pipe(
        switchMap((params: ParamMap) => {
          this.eventSlug = params.get('event') as string;
          return this.eventService.getEventsWithComps(this.eventSlug);
        }),
        tap((data) => {
          this.eventData = data;
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        })
      ).subscribe()
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() {
    this.actionCtrl.navLoading = false;
  }
}
