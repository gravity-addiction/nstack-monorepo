
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FsScoringClass } from '@classes/sdob-scoring/fs-scoring.class';
import { ActionCtrlService } from '@modules/app-common/services/action-ctrl.service';
import { HelperService } from '@modules/app-common/services/helper-scripts.service';
import { ConfigService } from '@modules/app-config/config.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { TokenService } from '@modules/auth/services/token.service';
import { VideoControlsButtonsItem, VideoControlsTimelineItem } from '@modules/video/components/index';
import { VideoFolderService, VideoPlayerService, VideoService, VideoUrlService } from '@modules/video/services/index';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, of, Subscription, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

// eslint-disable-next-line max-len
import { EventScorecardButtonsEndComponent, EventScorecardButtonsStartComponent, EventScorecardTimelineComponent } from '../../components/index';
import { EventsVideoService, EventVideoQueueService, EventVideoScorecardService, EventVideoTimesheetService } from '../../services/index';

// import { StorageService } from '../../../core/_services/storage.service';
// import { VideoSettingsCtrl, VideoSettingsSelectCtrl } from '../../modals';

import { IEventVideoQueue, IEventVideoQueueEntry } from '@typings/event';
import { IVideoPlayerInfoAws, IVideoPlayerInfoUrl } from '@typings/video';

declare const document: any;

@Component({
  selector: 'app-event-judging',
  templateUrl: './event-judging.component.html',
  styleUrls: ['./event-judging.component.scss'],
})
export class EventJudgingComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('VideoStatContainer', { static: true }) videoStatContainer!: ElementRef;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  @ViewChild('LocalFile', { static: true }) LocalFile: any;
  @ViewChild('videoPlayerTop') videoPlayerTop!: ElementRef;
  @ViewChild('fullscreenContainer') fullscreenContainer!: ElementRef;

  /*
  id: number;
  name: string;
  video: IVideoPlayerInfoAws | IVideoPlayerInfoUrl;
  judge: IEventVideoJudge;
  comp: IEventVideoComp;
  team: IEventVideoTeam;
  notes: string;
  round: number;
  draw: string[];
  score: number | null;
  maxScore: number | null;
  */
  public draggable = {
    data: 0,
    disable: false,
  };

  // Classes for Player and Timesheet
  videoPlayers: any[] = [];

  // Video Ontime Update

  public showHeader = true;
  public showLoader = true;
  public showSidebar = 0;

  public eventSlug = '';
  public failedEventLookup = false;
  public failedQueueLookup = false;

  public videoFileData: any = {};
  public isDragging = false;

  public videoInfo!: any;
  public videoServer!: string;
  public videoBucket!: string;
  public videoKey!: string;
  public videoUrl!: string;
  public videoMime!: string;
  public videoPreset!: string;

  public videoTimelineItem!: VideoControlsTimelineItem;
  public videoControlsStartItem!: VideoControlsButtonsItem;
  public videoControlsEndItem!: VideoControlsButtonsItem;

  public selectedPlayer = -1;
  public afterView = false;

  public nvBtnTxt = 'Not In View';
  public penaltyBtnTxt = 'penaltyBtnTxt';
  public omissionBtnTxt = 'Omission';

  private subscriptions: Subscription = new Subscription();
  private downTimer: any;

  constructor(
    public actionCtrl: ActionCtrlService,
    public authService: AuthService,
    public changeDetectorRef: ChangeDetectorRef,
    private cookieService: CookieService,
    private configService: ConfigService,
    private helperService: HelperService,
    public evsService: EventVideoScorecardService,
    public evService: EventsVideoService,
    private route: ActivatedRoute,
    public videoFolderService: VideoFolderService,
    public evqService: EventVideoQueueService,
    public videoService: VideoService,
    public videoUrlService: VideoUrlService,
    private tokenService: TokenService
  ) {

    // Add Player On Startup
    // const singlePlayer: any = this.addPlayer();
    // singlePlayer.scoring = new FsScoringClass();
    // this.selectedPlayer = 0;
    //////

    route.queryParams.subscribe((params) => {

      // Keep Local track of current Queryparams
      this.videoUrl = params.url;
      this.videoServer = params.server || 'us-west-2';
      this.videoBucket = params.bucket || 'sdob-videos';
      this.videoKey = params.key;
      this.videoPreset = params.preset || '';
      // Check and setup file type
      this.videoMime = '*';

      this.videoFolderService.folderService.shownServer = this.videoServer;
      this.videoFolderService.folderService.shownBucket = this.videoBucket;

      if (this.afterView && this.videoBucket && this.videoKey) {
        this.videoLoadAws(this.videoServer, this.videoBucket, this.videoKey).
          then((videoInfo: IVideoPlayerInfoAws | IVideoPlayerInfoUrl) => {
            // console.log('Video Info', videoInfo);
            if (this.videoPlayers[this.selectedPlayer].player.changeVideo(videoInfo)) {
              this.videoPlayers[this.selectedPlayer].player.showPlayer = true;
              this.videoPlayers[this.selectedPlayer].player.showControls = true;
              setTimeout(() => {
                this.videoPlayerTop.nativeElement.scrollIntoView({ behavior: 'auto' });
              }, 500);
              // this.videoPlayers[this.selectedPlayer].player.videoEle.play();
            }
          }).
          catch((_err) => {
            console.log('Loading Video Error', _err);
          });
      }
    });

  }


  @HostListener('window:drag', ['$event'])
  @HostListener('window:dragstart', ['$event'])
  @HostListener('window:dragend', ['$event'])
  @HostListener('window:dragover', ['$event'])
  @HostListener('window:dragenter', ['$event'])
  @HostListener('window:dragleave', ['$event'])
  handleWindowDrag(event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (event.type !== 'dragleave' && !this.isDragging) {
      this.isDragging = true;
      /*** setTimeout(() => { this.VideoDummyEle.nativeElement.style.backgroundColor = 'rgba(253, 88, 0, 0.8)'; }, 50); */
    } else if (event.type === 'dragleave' && event.x <= 0) {
      this.isDragging = false;
      /*** setTimeout(() => { this.VideoDummyEle.nativeElement.style.backgroundColor = ''; }, 50); */
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.videoService.allowInput) {
      return;
    }
    // event.preventDefault();
    this.executeKeyPress(event);

    // if not still the same key, stop the timer
    clearInterval(this.downTimer);
    this.downTimer = setInterval(() => {
      this.executeKeyPress(event);
    }, 250);
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardUpEvent(event: KeyboardEvent) {
    if (this.videoService.allowInput) {
      return;
    }
    // event.preventDefault();
    clearInterval(this.downTimer);
    this.downTimer = null;
  }

  @HostListener('window:resize', ['$event'])
  handleResizeEvent(event: any) {
    this.initWidth();
    this.checkVideoScreens();
  }

  @HostListener('window:DOMContentLoaded', ['$event'])
  @HostListener('window:scroll', ['$event'])
  @HostListener('window:load', ['$event'])
  handleVideoViewCheck(event: any) {
    this.checkVideoScreens();
  }


  @HostListener('fullscreenchange', ['$event'])
  @HostListener('webkitfullscreenchange', ['$event'])
  @HostListener('mozfullscreenchange', ['$event'])
  @HostListener('MSFullscreenChange', ['$event'])
  screenChange(event: any) {
    const fs = document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement;
    if (!fs) {
      this.videoService.isFullscreen = false;
    } else {
      this.videoService.isFullscreen = true;
    }
  }

  ngOnInit() {
    this.videoService.allowInput = false;

    // this.init_video_loading();
    this.subscriptions.add(
      this.route.paramMap.pipe(
        tap((params: ParamMap) => {
          this.eventSlug = params.get('event') as string;

          // Trigger Failed Lookup
          if (!this.eventSlug) {
            this.failedEventLookup = true;
          }
        }),
        switchMap(() => this.updateQueueList()),
        tap(() => {
          this.changeDetectorRef.detectChanges();
        }),
        catchError((err: any) => {
          this.failedQueueLookup = true;
          this.changeDetectorRef.detectChanges();
          return throwError(err);
        })
      ).subscribe()
    );

    // Auth Refreshed
    this.subscriptions.add(
      this.authService.authRefreshed$.pipe(
        map(() => {
          const userInfo = this.tokenService.authActive$.value || {};
          return userInfo;
        }),
        tap((userInfo: any) => {
          this.videoFolderService.newUserCleanup(); return of(userInfo);
        })
        /*
        switchMap((userInfo: any) => {
          if (userInfo.id) {
            return this.videoFolderService.initAwsFolders();
          } else {
            return of(true);
          }
        })
        */
        /*
        tap((userInfo: any) => {
          if (this._afterView) { return; }

          // flag the view as init, and try loading a waiting initial video
          this._afterView = true;
          this.video_load();
        })*/
      ).subscribe()
    );

    // Subscribe listener to pause video whenever the menu is opened
    this.subscriptions.add(
      this.actionCtrl.showMenuOpened.pipe(
        tap((isOpened: boolean) => {
          if (isOpened) {
            this.videoPlayers.forEach(p => {
              if (!p.player.videoEle.paused) {
                p.player.videoPause();
              }
            });
          }
        })
      ).subscribe()
    );

    /***
    // Subscribe to Scorecard Mark Changes
    this.subscriptions.add(
      this.videoTimesheetService.marks$.pipe(
        tap((marks: any[]) => {
          if (this.videoPlayerService.canvasCtx) {
            const score = this.videoScoringService.calculateScore(marks);
            const total = (marks || []).length - (this.videoTimesheetService.videoSettings.tossStartCount + 1);
            let scoreTotal = total;
            if (total < 0) { scoreTotal = 0; }
            if (score !== scoreTotal) {
              this.videoCanvasService.writeScore(this.videoPlayerService.canvasCtx, score.toString() + '/' + scoreTotal.toString());
            } else {
              this.videoCanvasService.writeScore(this.videoPlayerService.canvasCtx, scoreTotal.toString(), (total < 0) ? 'red' : 'green');
            }
          }
        })
      ).subscribe()
    );
    */
    /*
    this.subscriptions.add(
      this.videoFolderService.folderService.changeFolderObs.pipe(
        tap((data: any) => {
          if (!data) { return; }
          this._location.go('v/scoring', this.videoFolderService.folderService.createLocationQuery());
        })
      ).subscribe()
    );
    */
    // Setup LocalFile Input Field
    // if (this.LocalFile && this.LocalFile.nativeElement) {
    // this.LocalFile.nativeElement.addEventListener('change', this.onChangeLocalVideo.bind(this));
    // }
  }


  ngOnDestroy() {
    // Clean Subscriptions
    // try { this.LocalFile.nativeElement.removeEventListener('change', this.onChangeLocalVideo); } catch (e) { }
    this.subscriptions.unsubscribe();

    this.videoService.allowInput = true;
  }


  ngAfterViewInit() {
    // const [mW, mH] = this.videoPlayerService.getPlayerSize(this.videoService.isFullscreen);
    if (this.videoBucket && this.videoKey) {
      this.videoLoadAws(this.videoServer, this.videoBucket, this.videoKey).
        then((videoInfo: IVideoPlayerInfoAws | IVideoPlayerInfoUrl) => {
          if (this.videoPlayers[this.selectedPlayer].player.changeVideo(videoInfo)) {
            this.videoPlayers[this.selectedPlayer].player.showPlayer = true;
            this.videoPlayers[this.selectedPlayer].player.showControls = true;
            setTimeout(() => {
              this.videoPlayerTop.nativeElement.scrollIntoView({ behavior: 'auto' });
            }, 500);

            // this.videoPlayers[this.selectedPlayer].player.videoEle.play();
          }
        }).
        catch((_err: any) => {
          console.log('Loading Video Error', _err);
        });
    }

    if (this.videoPlayerTop) {
      this.videoService.fullscreenEle = this.fullscreenContainer;
    }
    this.afterView = true;
    this.actionCtrl.navLoading = false;
  }

  async dropVideo(event: any) {
    const fileData = event.data || {};
    if (fileData.hasOwnProperty('Key') && fileData.hasOwnProperty('bucket')) {
      await this.videoLoadAws(fileData.server, fileData.Key, fileData.bucket).
        then((videoInfo: IVideoPlayerInfoAws | IVideoPlayerInfoUrl) => {
          // console.log('Video Info', videoInfo);
          if (this.videoPlayers[this.selectedPlayer].player.changeVideo(videoInfo)) {
            this.videoPlayers[this.selectedPlayer].player.showPlayer = true;
            this.videoPlayers[this.selectedPlayer].player.showControls = true;
            setTimeout(() => {
              this.videoPlayerTop.nativeElement.scrollIntoView({ behavior: 'auto' });
            }, 500);

            // this.videoPlayers[this.selectedPlayer].player.videoEle.play();
          }
        }).
        catch((_err: any) => {
          console.log('Loading Video Error', _err);
        });
    }
  }

  selectPlayer(i: number) {
    this.selectedPlayer = i;
  }

  syncVideos() {
    this.videoPlayers.forEach(p => {
      if (!p.player.videoEle.paused) {
        p.player.videoPause();
      }
      p.player.videoGoto(p.player.videoLastPause);
    });
  }

  playStart() {
    this.videoPlayers.forEach(p => {
      p.player.videoStart();
    });
  }

  cleanPage() {
    // Unable to Play Video
    this.videoUrl = '';
  }

  //
  initWidth() {
    this.showHeader = !this.videoService.isFullscreen;
  }

  checkVideoScreens() {
    this.videoPlayers.forEach(p => {
      if (this.helperService.isElementInView(p.player.videoRef.nativeElement)) {
        p.player.videoRef.nativeElement.style.border = '';
      } else {
        p.player.videoRef.nativeElement.style.border = '5px dashed blue';
      }
    });
  }

  timesheetVideoSettingsGet() {
    // Update Timesheet Presets, mostly for score timing
    const staticKeys = Object.keys(this.configService.config.videoTimesheetSettings);
    return this.configService.config.videoTimesheetSettings[this.videoPreset] ||
      this.configService.config.videoTimesheetSettings[staticKeys[0]];
  }

  timesheetVideoSettingsAll() {
    const videoSettings = this.timesheetVideoSettingsGet();
    this.videoPlayers.forEach(p => {
      p.timesheet.videoSettings = videoSettings;
    });
  }

  addPlayer() {
    const ts = new EventVideoTimesheetService();
    ts.videoSettings = this.timesheetVideoSettingsGet();
    const newEntry: any = {
      player: new VideoPlayerService(),
      timesheet: ts,
    };
    this.videoPlayers.push(newEntry);
    this.videoTimelineItem = new VideoControlsTimelineItem(
      EventScorecardTimelineComponent, newEntry.player, { timesheet: ts }
    );
    this.videoControlsStartItem = new VideoControlsButtonsItem(
      EventScorecardButtonsStartComponent, newEntry.player, { timesheet: ts }
    );
    this.videoControlsEndItem = new VideoControlsButtonsItem(
      EventScorecardButtonsEndComponent, newEntry.player, { timesheet: ts }
    );
    return newEntry;
  }

  playFile(event: IEventVideoQueueEntry) {
    this.videoInfo = event;

    if (event.video && event.video.preset) {
      this.videoPreset = event.video.preset;
    }

    if (this.selectedPlayer === -1) {
      const singlePlayer: any = this.addPlayer();
      singlePlayer.scoring = new FsScoringClass();
      this.selectedPlayer = 0;
    } else {
      this.videoPlayers[this.selectedPlayer].scoring = new FsScoringClass();
      this.videoPlayers[this.selectedPlayer].timesheet.videoSettings = this.timesheetVideoSettingsGet();
      this.videoPlayers[this.selectedPlayer].timesheet.updateWorkingTime();
    }

    // Update scoring totals
    if (this.videoPlayers[this.selectedPlayer].scoring$) {
      try {
        this.videoPlayers[this.selectedPlayer].scoring$.unsubscribe();
      } catch (e) { }
    }
    /*
    this.videoPlayers[this.selectedPlayer].scoring$ = this.videoPlayers[this.selectedPlayer].timesheet.marks$.pipe(
      tap((marks: any[]) => {
        this.videoPlayers[this.selectedPlayer].scoring.totalScore = FsScoringClass.calculateScore(marks);
        this.videoPlayers[this.selectedPlayer].scoring.pointsInTime = FsScoringClass.calculatePit(marks);
      })
    ).subscribe();

    this.subscriptions.add(this.videoPlayers[this.selectedPlayer].scoring$);
    */

    if (event.video && event.video.hasOwnProperty('Key') && event.video.hasOwnProperty('bucket')) {
      // console.log('Play File', event);
      const eVideo: IVideoPlayerInfoAws = event.video as IVideoPlayerInfoAws;
      this.videoPlayers[this.selectedPlayer].player.videoTitle = event.name;
      this.videoLoadAws((eVideo.server || 'us-west-2'), eVideo.bucket, eVideo.Key).
        then((videoInfo: IVideoPlayerInfoAws | IVideoPlayerInfoUrl) => {
          // console.log('Video Info', videoInfo);
          // Update FPS
          if (event.video && event.video.fps) {
            videoInfo.fps = event.video.fps;
          }
          // Update Timeout
          if (event.video && event.video.timeout) {
            videoInfo.timeout = new Date().getTime() + (event.video.timeout * 1000);
          }

          this.videoInfo = event;

          if (this.videoPlayers[this.selectedPlayer].player.changeVideo(videoInfo)) {
            this.videoPlayers[this.selectedPlayer].player.showPlayer = true;
            this.videoPlayers[this.selectedPlayer].player.showControls = true;
            setTimeout(() => {
              try {
                window.scrollTo({
                  top: (this.videoPlayerTop.nativeElement.getBoundingClientRect().top + window.pageYOffset - 50),
                  behavior: 'auto'
                });
              } catch (e) {
                this.videoPlayerTop.nativeElement.scrollIntoView({ behavior: 'auto' });
              }
            }, 500);

            // this.videoPlayers[this.selectedPlayer].player.videoEle.play();
          }
        });
    } else {
      console.log('Cannot Play File', event);
    }
  }

  videoLoadAws(videoServer: string, videoBucket: string, videoKey: string
  ): Promise<IVideoPlayerInfoAws | IVideoPlayerInfoUrl> {
    // const bucketInfo = this.awsCtrl.getBucket(this.videoBucket);

    // Use Cookie Tokens
    if (this.tokenService.cookiesEnabled && this.cookieService.get('cookieSupport') && videoBucket === 'sdob-videos') {
      return this.videoUrlService.getVideoCookie(videoKey, videoBucket, videoServer).pipe(
        map((): IVideoPlayerInfoAws | IVideoPlayerInfoUrl => {
          const keyUrl = 'https://sdob-1.cloudfront.skydiveorbust.com/' + videoKey;
          const vInfo = { url: keyUrl, fps: 30 };
          return vInfo;
        })
      ).toPromise();

      // Use URL Token
    } else {
      const videoTimeout = new Date().getTime() + 30000;
      return this.videoUrlService.getVideoUrl(videoKey, videoBucket, videoServer).pipe(
        map((url: string): IVideoPlayerInfoAws | IVideoPlayerInfoUrl => {
          const vInfo = { url, fps: 30, timeout: videoTimeout };
          return vInfo;
        })
      ).toPromise();

    }
  }


  /***
    video_load() {
      if (this.videoUrl) {
        if (this.changeVideo({ url: this.videoUrl, fps: 30, timeout: 0, mime: (this.videoMime || '*') })) {
          this.videoEle.play();
        } else {
          this.videoLoaded = false;
        }


      // Loading by a video Key
      } else if (this.videoBucket && this.videoKey) {
        // const bucketInfo = this.awsCtrl.getBucket(this.videoBucket);
        // Using Cookies for authentication
        // cloudfront

        // Use Cookie Tokens
        if (this.tokenService.cookiesEnabled && this.cookieService.get('cookieSupport') && this.videoBucket === 'sdob-videos') {
          this.subscriptions.add(
            this.videoUrlService.getVideoCookie(this.videoKey, this.videoBucket, this.videoServer).pipe(
              tap(() => {
                const keyUrl = 'https://sdob-1.cloudfront.skydiveorbust.com/' + this.videoKey;
                if (this.gotoVideo({ url: keyUrl, fps: null, timeout: 0, mime: (this.videoMime || '*') })) {
                  this.videoEle.play();
                } else {
                  this.videoLoaded = false;
                }
              }),
              finalize(() => {
                this.videoLoaded = false;
              })
            ).subscribe()
          );

        // Use URL Token
        } else {

          console.log('A3');
          const videoTimeout = new Date().getTime() + 30000;
          this.subscriptions.add(
            this.getVideoUrl(this.videoKey, this.videoBucket, this.videoServer).pipe(
              tap((url: string) => {
                if (this.gotoVideo({ url, fps: null, mime: (this.videoMime || '*'), timeout: videoTimeout })) {
                  this.videoEle.play();
                } else {
                  this.videoLoaded = false;
                }
              }),
              catchError((err: any) => {
                this.videoLoaded = false;
                this.cleanPage();
                return throwError(err);
              })
            ).subscribe()
          );
        }

      // Nothing to Load
      } else {
        console.log('C1');
        this.videoLoaded = false;
        // console.log('No Video to Load');
      }
    }
  */

  addPoint(cls = 'point', score = 1) {
    this.evsService.addPoint(
      //    this.videoScoringService.addPoint(
      this.videoPlayers[this.selectedPlayer],
      cls,
      score
    );
  }

  // Tracking keypresses during video
  // preventDefault will not let people type into input boxes
  executeKeyPress(event: any) {
    const key = event.keyCode;
    if (key === 32) {
      this.videoPlayers[this.selectedPlayer].player.videoToggle();
      event.preventDefault();
    } else if (key === 39) { // Arrow Right
      this.videoPlayers[this.selectedPlayer].player.videoFrameMove(1);
      event.preventDefault();
    } else if (key === 38) { // Arrow Up
      this.videoPlayers[this.selectedPlayer].player.videoPlaybackRateMove(5);
      event.preventDefault();
    } else if (key === 37) { // Arrow Left
      this.videoPlayers[this.selectedPlayer].player.videoFrameMove(-1);
      event.preventDefault();
    } else if (key === 40) { // Arrow Down
      this.videoPlayers[this.selectedPlayer].player.videoPlaybackRateMove(-5);
      event.preventDefault();
    } else if (key === 66) { // B
      this.addPoint('bust');
      event.preventDefault();
    } else if (key === 78) { // N
      this.addPoint('nv');
      event.preventDefault();
    } else if (key === 79) { // O
      this.addPoint('omit');
      event.preventDefault();
    } else if (key === 80) { // P
      this.addPoint('point');
      event.preventDefault();
    }
    // else {
    // console.log(key);
    // }

  }

  updateQueueList() {

    return this.evService.getVideoQueueForUser(this.eventSlug).pipe(
      tap((resp: IEventVideoQueue[]) => {
        this.evqService.videoQueue.next(resp);
      })
    );
  }

  showHelp() {

  }

  showKeyboard() {

  }
  // eslint-disable-next-line max-lines
}
