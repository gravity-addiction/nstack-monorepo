// eslint-disable-next-line max-len
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, Type, ViewChild } from '@angular/core';
import { ActionCtrlService } from '@modules/app-common/services/action-ctrl.service';
import { VideoPlayerService, VideoService } from '@modules/video/services/index';
import { Subscription } from 'rxjs';

export class VideoControlsTimelineItem {
  constructor(public component: Type<any>, public videoPlayer: VideoPlayerService, public videoPlayerData: any) { }
}

export interface IVideoControlsTimelineComponent {
  videoPlayer: VideoPlayerService;
  videoPlayerData: any;
}

@Component({
  selector: 'app-video-controls-timeline',
  templateUrl: './video-controls-timeline.component.html',
  styleUrls: ['./video-controls-timeline.component.scss'],
})
export class VideoControlsTimelineComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input()
  set videoPlayer(v: VideoPlayerService) {
    this.videoPlayerService = v;

    if (!this.videoPlayerService || !this.videoPlayerService.videoEle) {
      return;
    }

    this.videoPlayerService.videoEle.addEventListener('timeupdate', () => {
      // this.progressUpdate();
    });

    this.videoPlayerService.videoEle.addEventListener('loadedmetadata', (e) => {
      // this.videoTimesheetService.totalDuration = this.videoPlayerService.videoEle.duration;
    });

    this.videoPlayerService.videoEle.addEventListener('loadeddata', this.onVideoLoaded);
    if (this.videoPlayerService.videoEle.readyState >= 3) {
      this.initWidth();
    }
  }

  @Input()
  set videoPlayerData(vD: any) {
    if (vD.controlsRight) {
      this.controlsRight = vD.controlsRight;
    }
  }

  @ViewChild('timeline', { static: false }) timelineEle!: ElementRef;

  public videoPlayerService!: VideoPlayerService;
  public progressPercent = 0;
  public markList: any[] = [];
  public controlsRight = 0; // Spacing for Right side Controls

  private subscriptions: Subscription = new Subscription();
  private _priorTime = 0;

  constructor(
    public actionCtrl: ActionCtrlService,
    private changeDetectorRef: ChangeDetectorRef,
    public videoService: VideoService
  ) { }

  @HostListener('fullscreenchange', ['$event'])
  @HostListener('webkitfullscreenchange', ['$event'])
  @HostListener('mozfullscreenchange', ['$event'])
  @HostListener('MSFullscreenChange', ['$event'])
  @HostListener('window:resize', ['$event'])
  handleResizeEvent(event: any) {
    setTimeout(() => {
      this.initWidth();
    }, 1);
  }



  ngOnInit() {

  }

  ngAfterViewInit() {
    if (this.videoPlayerService && this.videoPlayerService.videoEle) {
      this.videoPlayerService.videoEle.onplay = this.onTimeUpdate;
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    if (this.videoPlayerService.videoEle) {
      this.videoPlayerService.videoEle.removeEventListener('loadeddata', this.onVideoLoaded);
    }
  }

  onTimeUpdate = () => {
    // if (this.videoPlayerService.stopUpdating) { return; }
    if (!this.videoPlayerService.videoEle) {
      return;
    }
    if (this.videoPlayerService.videoEle.paused) {
      return;
    }

    const nowTime = this.videoPlayerService.videoEle.currentTime;
    this.progressUpdate();
    this._priorTime = nowTime;
    window.requestAnimationFrame(this.onTimeUpdate);
  };

  initWidth() {
    const [mW, mH] = this.videoPlayerService.getPlayerSize(this.videoService.isFullscreen);
    this.timelineEle.nativeElement.style.maxWidth = (
      (
        ((this.videoPlayerService.videoEle || {}).clientWidth || 0 > mW) ?
          mW :
          (this.videoPlayerService.videoEle || {}).clientWidth || 0
      ) - this.controlsRight
    ) + 'px';
  }

  cleanAll() {
    this.progressPercent = 0;
  }

  timelineClick(event: MouseEvent) {
    if (!this.videoPlayerService.videoEle) {
      return;
    }
    const fullWidth = this.timelineEle.nativeElement.clientWidth || 720;
    const progressPercent = event.offsetX / fullWidth;
    const newTime = ((this.videoPlayerService.videoEle || {}).duration || 0) * progressPercent;
    this.videoPlayerService.videoEle.currentTime = newTime;
  }

  progressUpdate() {
    if (!this.videoPlayerService.videoEle) {
      return;
    }
    // eslint-disable-next-line max-len
    let progressPercent = this.videoPlayerService.calcPercent(this.videoPlayerService.videoEle.currentTime, (this.videoPlayerService.videoEle.duration || 0));
    if (progressPercent > 99.9) {
      progressPercent = 99.9;
    }
    this.progressPercent = progressPercent;
    this.changeDetectorRef.detectChanges();
  }

  videoGoto(videoTime: number, e: any) {
    e.stopPropagation();
    if (this.videoPlayerService.videoEle) {
      this.videoPlayerService.videoEle.currentTime = videoTime;
    }
  }

  private onVideoLoaded = () => {
    this.initWidth();
  };

}
