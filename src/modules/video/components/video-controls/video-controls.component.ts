// eslint-disable-next-line max-len
import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActionCtrlService } from '@modules/app-common/services/action-ctrl.service';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { VideoControlsEndHostDirective, VideoControlsStartHostDirective, VideoTimelineHostDirective } from '../../directives/index';
import { VideoCanvasService, VideoPlayerService, VideoService } from '../../services/index';
import { VideoControlsButtonsComponent, VideoControlsButtonsItem } from '../video-controls-buttons/video-controls-buttons.component';
// eslint-disable-next-line max-len
import { IVideoControlsTimelineComponent, VideoControlsTimelineComponent, VideoControlsTimelineItem } from '../video-controls-timeline/video-controls-timeline.component';


@Component({
  selector: 'app-video-controls',
  templateUrl: './video-controls.component.html',
  styleUrls: ['./video-controls.component.scss'],
})
export class VideoControlsComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() videoSizeMultiplier!: number;
  @Input() showBasicControls = true;
  @Input() showMultibitSelection = true;
  @Input() showTimeline = true;
  @Input() showTimestamp = true;

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('videoPlayerService') set videoPlayer(v: VideoPlayerService) {
    this.videoPlayerService = v;

    if (this.videoPlayerService.videoEle) {
      // Add Loaded Event
      this.videoPlayerService.videoEle.addEventListener('loadeddata', this.onVideoLoaded);
      if (this.videoPlayerService.videoEle.readyState >= 3) {
        this.initWidth();
      }

      // Add Timestamp Event
      this.videoPlayerService.videoEle.addEventListener('timeupdate', this.onVideoTimeUpdate);
    }

    if (!this.videoTimeline) {
      this.videoTimeline = new VideoControlsTimelineItem(VideoControlsTimelineComponent, this.videoPlayerService, {});
    }
  }
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('videoTimeline') set videoTimelineItem(vT: VideoControlsTimelineItem) {
    this.videoTimeline = vT || this.videoTimeline;
  }
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('videoControlsStart') set videoControlsStartItem(v: VideoControlsButtonsItem) {
    this.videoControlsButtonsStart = v;
  }
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('videoControlsEnd') set videoControlsEndItem(v: VideoControlsButtonsItem) {
    this.videoControlsButtonsEnd = v;
  }
  @Input() videoPlayerData!: any;


  @ViewChild('VideoControls', { static: false }) videoControls!: ElementRef;
  @ViewChild('VideoTimelineWrap', { static: true }) videoTimelineWrap!: ElementRef;

  @ViewChild(VideoTimelineHostDirective, { static: true }) videoTimelineHost!: VideoTimelineHostDirective;
  @ViewChild(VideoControlsStartHostDirective, { static: true }) videoControlsStartHost!: VideoControlsStartHostDirective;
  @ViewChild(VideoControlsEndHostDirective, { static: true }) videoControlsEndHost!: VideoControlsEndHostDirective;

  @Output() videoFlash: EventEmitter<string> = new EventEmitter<string>();


  public videoPlayerService!: VideoPlayerService;
  public videoTimeline!: VideoControlsTimelineItem;

  public videoControlsButtonsStart!: VideoControlsButtonsItem;
  public videoControlsButtonsEnd!: VideoControlsButtonsItem;

  public videoControlsEnd: any;
  public videoControlsStart: any;
  public videoControlsTimeline: any;

  public videoControlsTimelineLeft = 150;
  public videoControlsTimelineRight = 0;

  public playbackTimestamp = '00:00:00';
  public progressPercent = 0;

  private subscriptions: Subscription = new Subscription();

  constructor(
    public actionCtrl: ActionCtrlService,
    private changeDetectorRef: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    public videoCanvasService: VideoCanvasService,
    public videoService: VideoService
  ) {

  }

  @HostListener('window:resize', ['$event'])
  @HostListener('fullscreenchange', ['$event'])
  @HostListener('webkitfullscreenchange', ['$event'])
  @HostListener('mozfullscreenchange', ['$event'])
  @HostListener('MSFullscreenChange', ['$event'])
  handleResizeEvent(event: any) {
    this.initWidth();
  }

  ngOnInit() {
    this.subscriptions.add(
      this.videoPlayerService.changedHlsEvent$.asObservable().pipe(
        tap((event: any) => {
          // console.log('HLS Event', event.event, event.level);
        })
      ).subscribe()
    );

    this.loadTimeline();
    this.loadControls('start');
    this.loadControls('end');

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    if (this.videoPlayerService.videoEle) {
      try {
        this.videoPlayerService.videoEle.removeEventListener('loadeddata', this.onVideoLoaded);
      } catch (e) { }
      try {
        this.videoPlayerService.videoEle.removeEventListener('timeupdate', this.onVideoTimeUpdate);
      } catch (e) { }
    }
  }

  ngAfterViewInit() {
    if (this.videoSizeMultiplier) {
      this.videoPlayerService.videoSizeMultiplier = this.videoSizeMultiplier;
    }

    this.initWidth();
  }

  initWidth() {
    const [mW, mH] = this.videoPlayerService.getPlayerSize(this.videoService.isFullscreen);
    this.videoControlsTimelineLeft = (this.videoControlsStart || {}).wid || this.videoControlsTimelineLeft;
    this.videoControlsTimelineRight = (this.videoControlsEnd || {}).wid || this.videoControlsTimelineRight;

    this.videoControls.nativeElement.style.width = mW + 'px';
    this.videoTimelineWrap.nativeElement.style.width = (mW - this.videoControlsTimelineLeft - this.videoControlsTimelineRight) + 'px';
    this.changeDetectorRef.detectChanges();
  }

  cleanAll() {
    this.playbackTimestamp = '00:00:00';
    this.progressPercent = 0;
  }

  goFullscreen() {
    this.videoService.fullscreen(this.videoPlayerService.videoContainerEle.nativeElement);
  }

  videoPause() {
    this.videoPlayerService.videoPause();
  }


  loadTimeline() {
    console.log('VTL', this.videoTimeline);
    if (!this.videoTimeline) {
      // console.log('No Timeline Component');
      return;
    }
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.videoTimeline.component);
    const viewContainerRef = this.videoTimelineHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<IVideoControlsTimelineComponent>(componentFactory);
    componentRef.instance.videoPlayer = this.videoTimeline.videoPlayer;
    componentRef.instance.videoPlayerData = this.videoTimeline.videoPlayerData;
    this.videoControlsTimeline = componentRef.instance;
  }

  loadControls(position: string) {

    // console.log('Loading', position, this.videoControlsButtonsStart, this.videoControlsStartHost);
    if (position === 'start' && this.videoControlsButtonsStart && this.videoControlsStartHost) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.videoControlsButtonsStart.component);
      const viewContainerRef = this.videoControlsStartHost.viewContainerRef;
      viewContainerRef.clear();

      const componentRef = viewContainerRef.createComponent<VideoControlsButtonsComponent>(componentFactory);
      componentRef.instance.videoPlayer = this.videoControlsButtonsStart.videoPlayer;
      componentRef.instance.videoPlayerData = this.videoControlsButtonsStart.videoPlayerData;
      this.videoControlsStart = componentRef.instance;

    } else if (position === 'end' && this.videoControlsButtonsEnd && this.videoControlsEndHost) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.videoControlsButtonsEnd.component);
      const viewContainerRef = this.videoControlsEndHost.viewContainerRef;
      viewContainerRef.clear();
      console.log('But End', this.videoControlsButtonsEnd);
      const componentRef = viewContainerRef.createComponent<VideoControlsButtonsComponent>(componentFactory);
      componentRef.instance.videoPlayer = this.videoControlsButtonsEnd.videoPlayer;
      componentRef.instance.videoPlayerData = this.videoControlsButtonsEnd.videoPlayerData;
      this.videoControlsEnd = componentRef.instance;
    }
  }


  private onVideoLoaded = () => {
    this.cleanAll();
    this.initWidth();
  };

  private onVideoTimeUpdate = (e: any) => {
    // Update Timestamp
    const curTime = (e.target || {}).currentTime || 0;
    this.playbackTimestamp = this.videoService.secToTime(curTime) || '00:00:00';
  };
}
