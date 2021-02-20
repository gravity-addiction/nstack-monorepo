import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';
import { EventsService } from '@modules/events/services/events.service';
import { CookieService } from 'ngx-cookie-service';
import { combineLatest, merge, of, Subscription, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-event-iframe',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-iframe.component.html',
  styleUrls: ['event-iframe.component.scss'],
})
export class EventIframeComponent implements OnInit, OnDestroy, AfterViewInit {
  public eventSlug = '';
  public regCode = '';
  public event: any;
  public eventReg: any;
  public regCodeHold = '';

  public failedEventLookup = false;
  public errorEventLookup = false;
  public failedRegLookup = false;
  public errorRegLookup = false;
  public windowHeight = 0;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private cookieService: CookieService,
    private eventsService: EventsService,
    private location: Location,
    private route: ActivatedRoute
  ) {

  }

  @HostListener('window:resize', ['$event'])
  handleResizeEvent(event: any) {
    this.sendHeight();
  }

  ngOnInit() {

    this.subscriptions.add(
      this.route.paramMap.pipe(
        switchMap((params: ParamMap) => {
          const eventSlug = params.get('event') as string;
          if (!eventSlug) {
            this.failedEventLookup = true;
            throwError({ error: 'NO_EVENT_SLUG' });
          }
          // Trigger Failed Lookup
          if (!eventSlug) {
            this.failedEventLookup = true;
          }

          return this.eventsService.getEvent(eventSlug);
        }),
        tap((e: any) => {
          if (e.status && e.status >= 500) {
            this.errorEventLookup = true;
          } else if (!e) {
            this.failedEventLookup = true;
          } else {
            this.failedEventLookup = false;
            this.errorEventLookup = false;
            this.event = e;
          }
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

    this.subscriptions.add(
      merge(
        this.route.paramMap.pipe(
          map((params: ParamMap) => ({ e: params.get('event') as string }))
        ),
        this.route.queryParams.pipe(
          filter((qP: any) => qP.hasOwnProperty('r')),
          map((qP: any) => ({ r: qP.r }))
        ),
        this.route.paramMap.pipe(
          map((params: ParamMap) => ({ r: params.get('shortcode') as string }))
        )
      ).pipe(
        tap((params: any) => {
          if (params.hasOwnProperty('e') && params.e !== null) {
            this.regCode = '';
            this.eventReg = null;
            this.updateEventInfo(params.e);
          } else if (params.hasOwnProperty('r') && params.r !== null) {
            if (this.eventSlug) {
              this.updateRegistration(params.r);
            } else {
              this.regCodeHold = params.r || '';
            }
          }
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

  updateEventInfo(eventSlug: string) {
    // Trigger Failed Lookup
    if (!eventSlug) {
      this.failedEventLookup = true; return;
    }

    this.subscriptions.add(
      this.eventsService.getEvent(eventSlug).pipe(
        tap((e: any) => {
          if (e.status && e.status >= 500) {
            this.errorEventLookup = true;
          } else if (!e) {
            this.failedEventLookup = true;
          } else {
            // console.log('Event Updated');
            this.eventSlug = eventSlug;
            this.failedEventLookup = false;
            this.errorEventLookup = false;
            this.event = e;

            if (this.regCodeHold || this.regCode) {
              const code = this.regCodeHold || this.regCode;
              return this.updateRegistration(code);
            }
          }
        }),
        tap(() => {
          this.changeDetectorRef.detectChanges();
          setTimeout(() => {
            this.sendHeight();
          }, 250);
        }),
        catchError((err: any) => {
          this.errorEventLookup = true;
          this.changeDetectorRef.detectChanges();
          setTimeout(() => {
            this.sendHeight();
          }, 100);
          return throwError(err);
        })
      ).subscribe()
    );
  }

  updateRegistration(regCode: string) {
    // Trigger Failed Lookup
    if (!regCode) {
      this.failedRegLookup = true; return;
    }

    this.subscriptions.add(
      this.eventsService.getRegistration(this.eventSlug, regCode).pipe(
        tap((eReg: any) => {
          if (eReg.status && eReg.status >= 500) {
            this.errorRegLookup = true;
          } else if (eReg.status && eReg.status === 404) {
            this.failedRegLookup = true;
          } else {
            this.regCode = eReg.short_id || regCode || '';
            this.regCodeHold = '';
            this.failedRegLookup = false;
            this.errorRegLookup = false;
            this.eventReg = eReg;
          }
        }),
        tap(() => {
          this.changeDetectorRef.detectChanges();
          setTimeout(() => {
            this.sendHeight();
          }, 100);
        }),
        catchError((err: any) => {
          if (err.status && err.status === 404) {
            this.failedRegLookup = true;
          }
          this.errorRegLookup = true;
          this.changeDetectorRef.detectChanges();
          setTimeout(() => {
            this.sendHeight();
          }, 100);
          return throwError(err);
        })
      ).subscribe()
    );
  }

  sendHeight() {
    if (parent.postMessage) {
      const height = document.body.scrollHeight;
      this.windowHeight = height;
      parent.postMessage(height, 'https://ghostnationals.com/');
    }
  }

  sendRegCode() {
    if (parent.postMessage) {
      parent.postMessage({ r: this.regCode }, 'https://ghostnationals.com/');
    }
  }

  sendEventInfo() {
    if (parent.postMessage) {
      parent.postMessage({ i: this.eventReg }, 'https://ghostnationals.com/');
    }
  }

  completedReg(regData: any) {
    const data = regData[0] || null;
    this.failedRegLookup = false;
    this.regCode = data.short_id || '';
    this.location.replaceState('/eiframe/' + encodeURIComponent(this.eventSlug) + '/' + encodeURIComponent(this.regCode));

    if (this.regCode) {
      this.eventsService.getRegistration(this.eventSlug, this.regCode).pipe(
        tap((eReg: any) => {
          if (eReg.status && eReg.status >= 500) {
            this.errorRegLookup = true;
          } else {
            this.failedRegLookup = false;
            this.errorRegLookup = false;
            this.eventReg = eReg;
            this.sendEventInfo();
          }
        }),
        tap(() => {
          this.changeDetectorRef.detectChanges();
          setTimeout(() => {
            this.sendHeight();
          }, 100);
        }),
        catchError((err: any) => {
          this.errorRegLookup = true;
          this.changeDetectorRef.detectChanges();
          return throwError(err);
        })
      ).subscribe();
    }
  }
}
