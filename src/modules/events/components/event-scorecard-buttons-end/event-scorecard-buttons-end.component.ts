import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActionCtrlService } from '@modules/app-common/services/action-ctrl.service';
import { ConfigService } from '@modules/app-config/config.service';
import { VideoPlayerService, VideoService } from '@modules/video/services/index';
import { Subscription } from 'rxjs';

import { EventVideoTimesheetService } from '../../services/index';

@Component({
  selector: 'app-event-scorecard-buttons-end',
  templateUrl: './event-scorecard-buttons-end.component.html',
  styleUrls: ['./event-scorecard-buttons-end.component.scss'],
})
export class EventScorecardButtonsEndComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input()
  set videoPlayer(v: VideoPlayerService) {
    this.videoPlayerService = v;

    if (!this.videoPlayerService || !this.videoPlayerService.videoEle) {
      return;
    }

    this.videoPlayerService.videoEle.addEventListener('timeupdate', () => {
      this.progressUpdate();
    });

    this.videoPlayerService.videoEle.addEventListener('loadedmetadata', (e) => {
      this.videoTimesheetService.totalDuration = (this.videoPlayerService.videoEle || {}).duration || 0;
    });

    this.videoPlayerService.videoEle.addEventListener('loadeddata', this.onVideoLoaded);
    if (this.videoPlayerService.videoEle.readyState >= 3) {
      this.initWidth();
    }
  }

  @Input()
  set videoPlayerData(vD: any) {
    if (vD.hasOwnProperty('timesheet') && vD.timesheet !== null) {
      this.videoTimesheetService = vD.timesheet;
    }
  }

  public videoPlayerService!: VideoPlayerService;
  public videoTimesheetService!: EventVideoTimesheetService;
  public baseWidth = 125;
  public get wid(): number {
    const modWid = 0;
    return this.baseWidth + modWid;
  }

  public markChanges!: Subscription;

  public progressPercent = 0;
  public markList: any[] = [];

  private _priorTime = 0;

  constructor(
    public actionCtrl: ActionCtrlService,
    private changeDetectorRef: ChangeDetectorRef,
    public configService: ConfigService,
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

  }

  ngOnDestroy() {

  }

  initWidth() {
    const [mW, mH] = this.videoPlayerService.getPlayerSize(this.videoService.isFullscreen);

  }

  cleanAll() {
    this.progressPercent = 0;
  }

  progressUpdate() {
    // eslint-disable-next-line max-len
    let progressPercent = this.videoPlayerService.calcPercent((this.videoPlayerService.videoEle || {}).currentTime || 0, this.videoTimesheetService.totalDuration);
    if (progressPercent > 99.9) {
      progressPercent = 99.9;
    }
    this.progressPercent = progressPercent;
    this.changeDetectorRef.detectChanges();
  }

  goFullscreen() {
    this.videoService.fullscreen(
      this.videoService.fullscreenEle.nativeElement ||
      this.videoPlayerService.videoContainerEle.nativeElement
    );
    this.changeDetectorRef.detectChanges();
  }

  videoGoto(videoTime: number, e: any) {
    e.stopPropagation();
    if (this.videoPlayerService.videoEle) {
      this.videoPlayerService.videoEle.currentTime = videoTime;
    }
  }

  changeVideoSettings(vidSettings: any) {
    if (this.videoTimesheetService) {
      this.videoTimesheetService.videoSettings = vidSettings;
      this.videoTimesheetService.updateWorkingTime();
    }
  }

  private onVideoLoaded = () => {
    this.initWidth();
  };

}
