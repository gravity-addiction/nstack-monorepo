import { Location } from '@angular/common';
// eslint-disable-next-line max-len
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { instanceOfVideoPlayerInfoUrl } from '@classes/video-player';
import { AwsS3UploadStatus, S3UploadService } from '@modules/aws/services/s3-upload.service';
import { EventsService } from '@modules/events/services/events.service';
import { EventsVideoService } from '@modules/events/services/events-video.service';
import { VideoControlsButtonsItem, VideoControlsTimelineItem } from '@modules/video/components/index';
// eslint-disable-next-line max-len
import { VideoControlsButtonsStartComponent } from '@modules/video/components/video-controls-buttons/video-controls-buttons-start/video-controls-buttons-start.component';
import { VideoControlsTimelineComponent } from '@modules/video/components/video-controls-timeline/video-controls-timeline.component';
import { VideoPlayerService } from '@modules/video/services/video-player.service';

import { merge, Subscription, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-event-videos-iframe',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-videos-iframe.component.html',
  styleUrls: ['event-videos-iframe.component.scss'],
})
export class EventVideosIframeComponent implements OnInit, OnDestroy, AfterViewInit {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  @ViewChild('FileInput', { static: false }) FileInput!: ElementRef;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  @ViewChild('VideoControls', { static: false }) VideoControls!: any;

  subscriptions: Subscription = new Subscription();
  subscriptionsUpload: Subscription = new Subscription();

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


  public canUpload = false;
  public acceptFile = true;
  public isUploading = false;
  public currentUpload!: any;
  public progressSent = 0;
  public processingBtn = '';
  public progressLoaded = 0;
  public progressTotal = 0;

  // public videoTimesheet = new VideoTimesheetService();
  public videoHasError = false;
  public videoIsLoaded = false;


  public videoPlayers: any[] = [];
  public videoTimelineItem!: VideoControlsTimelineItem;
  public videoControlsStartItem!: VideoControlsButtonsItem;
  public videoControlsEndItem!: VideoControlsButtonsItem;
  public selectedPlayer = -1;

  private _localFile: any;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private eventsService: EventsService,
    private evService: EventsVideoService,
    private location: Location,
    private route: ActivatedRoute,
    public s3UploadService: S3UploadService
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
    this.subscriptionsUpload.unsubscribe();
    this.destroyListeners();
  }

  ngAfterViewInit() {
    this.setListeners();
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
        }),
        catchError((err: any) => {
          if (err.status && err.status === 404) {
            this.failedRegLookup = true;
          }
          this.errorRegLookup = true;
          this.changeDetectorRef.detectChanges();
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




  addPlayer() {
    // console.log('Adding Player');
    const newEntry: any = {
      player: new VideoPlayerService(),
    };
    this.videoPlayers.push(newEntry);
    this.selectedPlayer = this.videoPlayers.length - 1;
    this.videoTimelineItem = new VideoControlsTimelineItem(VideoControlsTimelineComponent, newEntry.player, {});
    this.videoControlsStartItem = new VideoControlsButtonsItem(VideoControlsButtonsStartComponent, newEntry.player, {});
    // this.videoControlsEndItem = new VideoControlsButtonsItem(EventScorecardButtonsEndComponent, newEntry.player, { timesheet: ts });
    return newEntry;
  }

  setListeners() {
    if (this.FileInput && this.FileInput.nativeElement) {
      this.FileInput.nativeElement.addEventListener('change', this.onChangeLocalVideo);
    }
  }

  destroyListeners() {
    if (this.FileInput && this.FileInput.nativeElement) {
      this.FileInput.nativeElement.removeEventListener('change', this.onChangeLocalVideo);
    }
  }

  cancelUpload() {
    this.subscriptionsUpload.unsubscribe();
    setTimeout(() => {
      this.sendHeight();
    }, 100);
    if (this.currentUpload && this.currentUpload.cancel$) {
      this.currentUpload.cancel$.next('Go!');
    }
    this.isUploading = false;
    this.acceptFile = true;
    this.subscriptionsUpload = new Subscription();
    this.progressLoaded = 0;
    this.progressTotal = 0;
    this.progressSent = 0;
  }

  cleanAll() {
    this.videoHasError = false;
    this.canUpload = false;
    this.isUploading = false;
    setTimeout(() => {
      this.sendHeight();
    }, 100);
  }


  videoLoaded() {
    this.videoHasError = false;
    this.videoIsLoaded = true;
    setTimeout(() => {
      this.sendHeight();
      this.VideoControls.initWidth();
    }, 100);

  }

  videoError(err: any) {
    this.videoHasError = true;
    this.videoPlayers[this.selectedPlayer].showPlayer = false;
    this.isUploading = false;
    this.acceptFile = true;
    setTimeout(() => {
      this.sendHeight();
    }, 100);
  }



  playFile(singlePlayer: any) {
    console.log(singlePlayer);
    if (this._localFile && singlePlayer && singlePlayer.player) {
      const videoInfo = singlePlayer.player.getLocalFileVideoInfo(this._localFile);
      console.log(videoInfo);
      if (videoInfo && instanceOfVideoPlayerInfoUrl(videoInfo) && singlePlayer.player.changeVideo(videoInfo)) {
        singlePlayer.player.showPlayer = true;
        singlePlayer.player.showControls = true;
        setTimeout(() => {
          this.sendHeight();
        }, 100);
      } else {
        //  console.log('Cannot Load Video');
      }
    }
  }

  async uploadFile() {
    const f = this._localFile || '';
    if (!f) {
      return;
    }
    const fName = f.name;
    const fType = f.type;
    const discipline = this.uploadingDiscipline;
    const upRound = this.uploadingRound;
    this.isUploading = true;
    this.acceptFile = false;
    // const fileData = await this.sha256.getHash(f);
    // console.log('File Data', fileData);
    const uploadData = {
      discipline,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      short_id: this.regCode,
      rnd: upRound,
    };

    this.subscriptionsUpload.add(
      this.s3UploadService.uploadStatus.pipe(
        tap((data: any) => {
          // In Progress
          if (data.hasOwnProperty('progress')) {
            this.progressSent = (parseInt(data.progress, 10) || 0) * 100 || 0;
            this.progressLoaded = data.loaded || 0;
            this.progressTotal = data.total || 0;
          }

          // Finishing Up
          if (data.status === AwsS3UploadStatus.IDLE && data.progress >= 1) {
            this.isUploading = false;
            this.acceptFile = true;

            // Finished
          } else if (data.status === AwsS3UploadStatus.FINISHED && this.isUploading) {
            this.isUploading = false;
            this.acceptFile = true;
            setTimeout(() => {
              this.ngAfterViewInit();
            }, 250);
          } else if (data.status === AwsS3UploadStatus.ERROR) {
            this.videoError(data.err);
            // console.log('Upload Error!', data.err);
          }
        }),
        tap(() => {
          this.changeDetectorRef.detectChanges();
          setTimeout(() => {
            this.sendHeight();
          }, 100);
        }),
        catchError((err: any) => {
          this.videoError(err);
          return throwError(err);
        })
      ).subscribe()
    );

    this.subscriptionsUpload.add(
      this.evService.getPostUrl(this.eventSlug, fName, fType, uploadData).pipe(
        // Send file to aws server
        map((url: string) => this.s3UploadService.addFileToQueue(url, fType, f, uploadData)),

        // Attach upload latest queueEntry to currentUpload
        tap((queueEntry: any) => {
          this.currentUpload = queueEntry;
          setTimeout(() => {
            this.sendHeight();
          }, 100);
        })
      ).subscribe()
    );
  }


  private onChangeLocalVideo = (e: any) => {
    // File Changed');
    this._localFile = e.target.files[0];
    // this.fileStatus.emit({ status: 'changed', f: e.target.files });
    this.canUpload = true;
    if (this.videoPlayers.length === 0) {
      const singlePlayer: any = this.addPlayer();
    }
    setTimeout(() => {
      this.changeDetectorRef.detectChanges();
      this.sendHeight();
    }, 100);
  };
  // eslint-disable-next-line max-lines
}
