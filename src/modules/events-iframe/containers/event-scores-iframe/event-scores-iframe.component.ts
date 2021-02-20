import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { S3UploadService } from '@modules/aws/services/index';
import { EventsService } from '@modules/events/services/index';
import { Subscription, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-event-scores-iframe',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-scores-iframe.component.html',
  styleUrls: ['event-scores-iframe.component.scss'],
})
export class EventScoresIframeComponent implements OnInit, OnDestroy, AfterViewInit {

  subscriptions: Subscription = new Subscription();

  eventSlug = '';
  regCode = '';
  event: any;
  eventReg: any;
  regCodeHold = '';
  uploadingRound = 1;
  uploadingDiscipline = 'CF2S';

  failedEventLookup = false;
  errorEventLookup = false;
  failedRegLookup = false;
  errorRegLookup = false;

  windowHeight = 0;
  loading = true;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    public s3UploadService: S3UploadService
  ) {

  }

  @HostListener('window:resize', ['$event'])
  handleResizeEvent(event: any) {
    this.sendHeight();
  }

  ngOnInit() {
    this.loading = true;
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
  }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.sendHeight();
    }, 1000);
  }

  sendHeight() {
    if (parent.postMessage) {
      const height = document.body.scrollHeight;
      this.windowHeight = height;
      parent.postMessage(height, 'https://ghostnationals.com/');
    }
  }
}
