import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActionCtrlService } from '@modules/app-common/services/action-ctrl.service';
import { VideoPlayerService, VideoService } from '@modules/video/services/index';
import { Subscription } from 'rxjs';

import { EventVideoTimesheetService } from '../../services/index';

@Component({
  selector: 'app-event-scorecard-buttons-start',
  templateUrl: './event-scorecard-buttons-start.component.html',
  styleUrls: ['./event-scorecard-buttons-start.component.scss'],
})
export class EventScorecardButtonsStartComponent implements OnInit, OnDestroy, AfterViewInit {

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
  public baseWidth = 150;
  public get wid(): number {
    let modWid = 0;
    if (this.videoPlayerService.videoHls) {
      modWid += 25;
    }
    return this.baseWidth + modWid;
  }

  public markChanges!: Subscription;
  public progressPercent = 0;
  public markList: any[] = [];

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

  videoGoto(videoTime: number, e: any) {
    e.stopPropagation();
    if (this.videoPlayerService.videoEle) {
      this.videoPlayerService.videoEle.currentTime = videoTime;
    }
  }


  videoRewind() {
    if (!this.videoPlayerService.videoEle) {
      return;
    }
    if (this.videoTimesheetService.workingTimeStart > -1 &&
      this.videoPlayerService.videoEle.currentTime !== this.videoTimesheetService.workingTimeStart
    ) {
      this.videoPlayerService.videoGoto(this.videoTimesheetService.workingTimeStart);
    } else if (
      this.videoTimesheetService.prestartTimeStart > -1 &&
      this.videoPlayerService.videoEle.currentTime !== this.videoTimesheetService.prestartTimeStart
    ) {
      this.videoPlayerService.videoGoto(this.videoTimesheetService.prestartTimeStart);
    } else {
      this.videoPlayerService.videoGoto(0);
    }
  }

  videoForward() {
    if (!this.videoPlayerService.videoEle) {
      return;
    }
    if (this.videoTimesheetService.workingTimeEnd > -1) {
      this.videoPlayerService.videoGoto(this.videoTimesheetService.workingTimeEnd);
    } else if (this.videoPlayerService.videoEle.duration > 0) {
      this.videoPlayerService.videoGoto(this.videoPlayerService.videoEle.duration);
    }
  }

  private onVideoLoaded = () => {
    this.initWidth();
  };
}
