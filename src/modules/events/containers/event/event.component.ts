import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ActionCtrlService } from '@modules/app-common/services/action-ctrl.service';
import { S3UploadService } from '@modules/aws/services/s3-upload.service';
import { VideoPlayerComponent } from '@modules/video/components/video-player/video-player.component';
import { VideoPlayerService } from '@modules/video/services/video-player.service';
import { Observable, of, Subscription, throwError } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';

import { EventsService } from '../../services';

import { Event } from '@typings/event';

@Component({
    selector: 'app-event',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './event.component.html',
    styleUrls: ['event.component.scss'],
})
export class EventComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('VideoPlayer', { static: false }) videoPlayer!: VideoPlayerComponent;

  subscriptions: Subscription = new Subscription();
  loading = true;

  eventSlug = '';
  regCode = '';
  event: any;
  eventReg: any;

  failedEventLookup = false;
  errorEventLookup = false;
  failedRegLookup = false;
  errorRegLookup = false;

  videoPlayerService: VideoPlayerService;

  constructor(
    public actionCtrl: ActionCtrlService,
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService,
    private changeDetectorRef: ChangeDetectorRef,
    public s3UploadService: S3UploadService
  ) {
    this.videoPlayerService = new VideoPlayerService();
  }

  ngOnInit() {
    this.loading = true;
    // Parse Event Slug
    // Save information to ->event
    this.subscriptions.add(
      this.route.paramMap.pipe(
        tap((params: ParamMap) => {
          this.eventSlug = params.get('event') as string;

          // Trigger Failed Lookup
          if (!this.eventSlug) {
 this.failedEventLookup = true;
}
        }),
        switchMap((params: ParamMap) => this.eventsService.getEventsWithComps(params.get('event') as string)),
        tap((e: any) => {
          if (e.status && e.status >= 500) {
 this.errorEventLookup = true;
          } else if (!e) {
 this.failedEventLookup = true;
          } else {
            this.failedEventLookup = false;
            this.event = e;
          }
        }),
        tap(() => {
 this.loading = false;
}),
        tap(() => {
 this.changeDetectorRef.detectChanges();
}),
        catchError((err: any) => {
          this.errorEventLookup = true;
          this.changeDetectorRef.detectChanges();
          return throwError(err);
        })
      ).subscribe()
    );

    // Parse Registration Code
    this.subscriptions.add(
      this.route.queryParams.pipe(
        filter((params: any) => !!params.r),
        switchMap((params: any) => {
          this.regCode = params.r || '';
          if (this.regCode) {
            return this.eventsService.getRegistration(this.eventSlug, this.regCode);
          } else {
            this.failedRegLookup = true;
            return throwError('Blank Registration Code Provided.');
          }
        }),
        tap((eReg: any) => {
          if (eReg.status && eReg.status >= 500) {
 this.errorRegLookup = true;
          } else {
            this.eventReg = eReg;
          }
        }),
        tap(() => {
 this.changeDetectorRef.detectChanges();
}),
        catchError((err: any) => {
          this.failedRegLookup = true;
          this.changeDetectorRef.detectChanges();
          return throwError(err);
        })
      ).subscribe()
    );

  }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() {

  }

  fileStatus(event: any, rnd: number) {
    // console.log('Change File', rnd, event);
    // this.videoPlayer.changeLocalVideo(event.f[0]);
    // console.log('Changed Video');
    // this.changeDetectorRef.detectChanges();
  }

  editEvent() {
    this.router.navigateByUrl(`/eadmin/${encodeURIComponent(this.eventSlug)}`);
  }

  openEventSheet() {
    if (!this.event) {
 return;
}
    window.open('https://docs.google.com/spreadsheets/d/' + encodeURIComponent(this.event.sheet_id));
  }
}
