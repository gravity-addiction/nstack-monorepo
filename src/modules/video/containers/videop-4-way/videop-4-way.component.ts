import { Location } from '@angular/common';
// eslint-disable-next-line max-len
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FsScoringClass } from '@classes/sdob-scoring/fs-scoring.class';
import { ActionCtrlService } from '@modules/app-common/services/action-ctrl.service';
import { Sha256Service } from '@modules/app-common/services/sha256.service';
import { ConfigService } from '@modules/app-config/config.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { TokenService } from '@modules/auth/services/token.service';
import { AwsCtrlService } from '@modules/aws/services/aws-ctrl.service';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, of, Subscription, throwError } from 'rxjs';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';

// import { StorageService } from '../../../core/_services/storage.service';
// import { VideoSettingsCtrl, VideoSettingsSelectCtrl } from '../../modals';
// eslint-disable-next-line max-len
import { VideoControlsButtonsEndClippingComponent, VideoControlsButtonsItem, VideoControlsButtonsStartComponent, VideoControlsTimelineComponent, VideoControlsTimelineItem } from '../../components';
import { VideoCanvasService, VideoFolderService, VideoPlayerService, VideoService, VideoUrlService } from '../../services';

import { IFolder } from '@typings/aws-folders';
import { IVideoPlayerInfoAws, IVideoPlayerInfoUrl } from '@typings/video';

declare const document: any;

@Component({
  selector: 'app-videop-4-way',
  templateUrl: './videop-4-way.component.html',
  styleUrls: ['./videop-4-way.component.scss'],
})
export class Videop4WayComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('VideoStatContainer', { static: true }) videoStatContainer!: ElementRef;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  @ViewChild('LocalFile', { static: true }) LocalFile: any;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  @ViewChildren('VideoBoxes', { read: ElementRef }) VideoBoxes!: QueryList<ElementRef>;

  public draggable = {
    data: 0,
    disable: false,
  };

  // Classes for Player and Timesheet
  public videoPlayers: any[] = [];
  // videoScoringService: FsScoringClass;

  // Video Ontime Update

  public showHeader = true;
  public showLoader = true;

  public videoFileData: any = {};
  public isDragging = false;

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

  private subscriptions: Subscription = new Subscription();
  private _afterView = false;
  private _videoOpened = false;

  private errorOverflow = false;
  private downTimer: any;


  constructor(
    public actionCtrl: ActionCtrlService,
    public authService: AuthService,
    // public videoSettingsCtrl: VideoSettingsCtrl,
    public videoService: VideoService,
    public videoUrlService: VideoUrlService,
    public videoFolderService: VideoFolderService,

    private _awsCtrl: AwsCtrlService,
    private changeDetectorRef: ChangeDetectorRef,
    private cookieService: CookieService,
    private configService: ConfigService,
    private _location: Location,
    private route: ActivatedRoute,
    private _router: Router,
    private _sha256: Sha256Service,
    private tokenService: TokenService,
    private videoCanvasService: VideoCanvasService,
    // private videoSettingsSelectCtrl: VideoSettingsSelectCtrl,
  ) {
    // this.addPlayer();

    this.subscriptions.add(
      route.queryParams.subscribe((params) => {

        // Keep Local track of current Queryparams
        this.videoUrl = params.url;
        this.videoServer = params.server;
        this.videoBucket = params.bucket;
        this.videoKey = params.key;
        this.videoPreset = params.preset || '';
        // Check and setup file type
        this.videoMime = '*';

        /*** if (this._afterView) { this.video_load(); } */
      })
    );

    this.subscriptions.add(
      this.videoFolderService.folderService.changeFolderObs.
        pipe(
          tap(f => {
            // console.log('Changing Folder Event 4Way', f);
          })
        ).subscribe()
    );
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
    /*** this.executeKeyPress(event); */

    // if not still the same key, stop the timer
    clearInterval(this.downTimer);
    this.downTimer = setInterval(() => {
      /*** this.executeKeyPress(event); */
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

    // Auth Refreshed
    this.subscriptions.add(
      this.authService.authRefreshed$.pipe(
        map(() => {
          const userInfo = this.tokenService.authActive$.value || {};
          return userInfo;
        }),
        tap((userInfo: any) => {
          this.videoFolderService.newUserCleanup(); return of(userInfo);
        }),
        switchMap((userInfo: any) => {
          if (userInfo.id) {
            return this.videoFolderService.initAwsFolders();
          } else {
            return of(true);
          }
        })
        /* tap((userInfo: any) => {
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

    // Setup LocalFile Input Field
    if (this.LocalFile && this.LocalFile.nativeElement) {
      // this.LocalFile.nativeElement.addEventListener('change', this.onChangeLocalVideo.bind(this));
    }
  }


  ngOnDestroy() {
    // Clean Subscriptions
    // try { this.LocalFile.nativeElement.removeEventListener('change', this.onChangeLocalVideo); } catch (e) { }
    this.subscriptions.unsubscribe();

    this.videoService.allowInput = true;
  }


  ngAfterViewInit() {
    // const [mW, mH] = this.videoPlayerService.getPlayerSize(this.videoService.isFullscreen);

    this.actionCtrl.navLoading = false;
  }

  async dropVideo(event: any, ind: number) {
    if (this.videoPlayers.length > ind) {

      const fileData = event.data || {};
      if (fileData.hasOwnProperty('Key') && fileData.hasOwnProperty('bucket')) {
        this.videoLoadAws((fileData.server || 'us-west-2'), fileData.bucket, fileData.Key).
          then((videoInfo: IVideoPlayerInfoAws | IVideoPlayerInfoUrl) => {
            if (this.videoPlayers[ind].player.changeVideo(videoInfo)) {
              this.videoPlayers[ind].player.showPlayer = true;
              this.videoPlayers[ind].player.showControls = true;
              this.videoPlayers[ind].player.videoEle.play();
            }
          });
      }
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
      p.player.videoToggle();
    });
  }

  cleanPage() {
    // Unable to Play Video
    this.videoUrl = '';
  }

  //
  initWidth() {

    const dW = document.body.clientWidth || window.innerWidth;
    if (this.videoPlayers.length < 2 || dW < 482.2) {
      this.videoPlayers.forEach(p => {
        p.player.videoBoxWidth = '100%';
        p.player.videoSizeMultiplier = 1;
      });
    } else {
      this.videoPlayers.forEach(p => {
        p.player.videoBoxWidth = '50%';
        p.player.videoSizeMultiplier = .5;
      });
    }

    this.showHeader = !this.videoService.isFullscreen;
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
    const newEntry: any = {
      player: new VideoPlayerService(),
    };
    newEntry.timeline = new VideoControlsTimelineItem(VideoControlsTimelineComponent, newEntry.player, {});
    newEntry.startbtns = new VideoControlsButtonsItem(VideoControlsButtonsStartComponent, newEntry.player, {});
    newEntry.endbtns = new VideoControlsButtonsItem(VideoControlsButtonsEndClippingComponent, newEntry.player, {});
    this.videoPlayers.push(newEntry);

    this.selectedPlayer = this.videoPlayers.length - 1;
    this.videoPlayers[this.selectedPlayer].player.showPlayer = true;
    this.changeDetectorRef.detectChanges();
  }

  playFile(event: any) {
    if (event.hasOwnProperty('Key') && event.hasOwnProperty('bucket')) {
      // console.log('Play File', event);
      this.videoLoadAws((event.server || 'us-west-2'), event.bucket, event.Key).
        then((videoInfo: IVideoPlayerInfoAws | IVideoPlayerInfoUrl) => {
          if (this.selectedPlayer < 0) {
            this.addPlayer();
          }
          if (this.videoPlayers[this.selectedPlayer].player.changeVideo(videoInfo)) {
            this.videoPlayers[this.selectedPlayer].player.showPlayer = true;
            this.videoPlayers[this.selectedPlayer].player.showControls = true;
            // this.videoPlayers[0].player.videoEle.play();
          }
        });
    } else {
      console.log('Cannot Play File', event);
    }
  }

  videoLoadAws(videoServer: string, videoBucket: string, videoKey: string): Promise<IVideoPlayerInfoAws | IVideoPlayerInfoUrl> {
    // const bucketInfo = this.awsCtrl.getBucket(this.videoBucket);

    // Use Cookie Tokens
    if (this.tokenService.cookiesEnabled && this.cookieService.get('cookieSupport') && videoBucket === 'sdob-videos') {
      return this.videoUrlService.getVideoCookie(videoKey, videoBucket, videoServer).pipe(
        map((): IVideoPlayerInfoAws | IVideoPlayerInfoUrl => {
          const keyUrl = 'https://sdob-1.cloudfront.skydiveorbust.com/' + videoKey;
          return { url: keyUrl, fps: 30, timeout: 0, mime: '*' };
        })
      ).toPromise();

      // Use URL Token
    } else {
      const videoTimeout = new Date().getTime() + 30000;
      return this.videoUrlService.getVideoUrl(videoKey, videoBucket, videoServer).pipe(
        map((url: string): IVideoPlayerInfoAws | IVideoPlayerInfoUrl => ({ url, fps: 30, mime: '*', timeout: videoTimeout }))
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

  // eslint-disable-next-line max-lines
}
