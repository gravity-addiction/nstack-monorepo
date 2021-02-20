// eslint-disable-next-line max-len
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FsScoringClass } from '@classes/sdob-scoring/fs-scoring.class';
import { ActionCtrlService } from '@modules/app-common/services/action-ctrl.service';
import { VideoPlayerService, VideoService } from '@modules/video/services/index';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { EventVideoTimesheetService } from '../../services';

@Component({
  selector: 'app-event-scorecard-timeline',
  templateUrl: './event-scorecard-timeline.component.html',
  styleUrls: ['./event-scorecard-timeline.component.scss'],
})
export class EventScorecardTimelineComponent implements OnInit, OnDestroy, AfterViewInit {

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
    if (vD.controlsRight) {
      this.controlsRight = vD.controlsRight;
    }

    if (vD.hasOwnProperty('timesheet') && vD.timesheet !== null) {
      this.videoTimesheetService = vD.timesheet;
    }
  }

  @ViewChild('timeline', { static: false }) timelineEle!: ElementRef;

  public videoPlayerService!: VideoPlayerService;
  public videoTimesheetService!: EventVideoTimesheetService;
  public videoScoringClass!: any;

  public progressPercent = 0;

  public markList: any[] = [];
  public totalScore = 0;
  public pointsInTime = 0;

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
    this.subscriptions.add(
      this.videoTimesheetService.marks$.pipe(
        tap((marks: any) => {
          this.markList = [];

          // console.log('Marks', marks);
          (marks || []).map((m: any) => {
            m.left = this.videoPlayerService.calcPercent(m.time, this.videoTimesheetService.totalDuration);
            this.markList.push(m);
          });

          this.totalScore = FsScoringClass.calculateScore(marks);
          this.pointsInTime = FsScoringClass.calculatePit(marks);

          this.changeDetectorRef.detectChanges();
        })
      ).subscribe()
    );
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

    // Activate Freezeframe
    if (this.videoTimesheetService.isFreezing &&
      this.videoTimesheetService.workingTimeEnd > -1 &&
      nowTime - this._priorTime < 0.4 && nowTime - this._priorTime >= 0 &&
      (nowTime + .02) >= this.videoTimesheetService.workingTimeEnd + ((this.videoTimesheetService.videoSettings.postFreezeFrameTime || 0))
    ) {
      this.videoPlayerService.videoEle.pause();
      // this.videoTimesheetService.frozenTimestamp = this.videoTimesheetService.workingTimeEnd;
      this.videoPlayerService.videoEle.currentTime = this.videoTimesheetService.workingTimeEnd;
      if (this.videoTimesheetService.workingTimeStart === -1 && this.videoTimesheetService.prestartTimeEnd > -1) {
        this.videoTimesheetService.workingtimeSet(this.videoTimesheetService.prestartTimeEnd);
        this.videoTimesheetService.updateWorkingPercentages();
      }
    }


    // Activate Working Time
    if (this.videoTimesheetService.prestartTimeStart > -1 &&
      this.videoTimesheetService.workingTimeStart === -1 &&
      this.videoTimesheetService.prestartTimeEnd <= nowTime &&
      this._priorTime < this.videoTimesheetService.prestartTimeEnd &&
      nowTime - this._priorTime < 0.4 && nowTime - this._priorTime >= 0
    ) {
      this.videoTimesheetService.workingtimeSet(this.videoTimesheetService.prestartTimeEnd);
      this.videoTimesheetService.updateWorkingPercentages();
    }
    /*
    if (!this._freezeFrameTimeout$ &&
        this.videoTimesheetService.workingTimeEnd &&
        nowTime >= this.videoTimesheetService.workingTimeEnd &&
        this._priorTime < this.videoTimesheetService.workingTimeEnd
    ) {
      // Will Continue Past Freeze Frame, Show Flash only once
      if (this.videoTimesheetService.isFreezing && this.videoTimesheetService.videoSettings.postFreezeFrameTime) {
        this.videoPlayerService.video_flash('red');
        this.videoTimesheetService.frozenTimestamp = new Date().getTime();

        this._freezeFrameTimeout$ = setTimeout(() => {
          this.videoPlayerService.videoEle.pause();
          this.videoPlayerService.videoEle.currentTime = this.videoTimesheetService.workingTimeEnd;
          this._freezeFrameTimeout$ = null;
        }, this.videoTimesheetService.videoSettings.postFreezeFrameTime * 1000);
      } else if (this.videoTimesheetService.isFreezing) {
        this.videoTimesheetService.frozenTimestamp = new Date().getTime();
        this.videoPlayerService.videoEle.pause();
        this.videoPlayerService.videoEle.currentTime = this.videoTimesheetService.workingTimeEnd;
      }
    }
    */

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
    const newTime = this.videoTimesheetService.totalDuration * progressPercent;
    this.videoPlayerService.videoEle.currentTime = newTime;
  }

  progressUpdate() {
    if (!this.videoPlayerService.videoEle) {
      return;
    }
    // eslint-disable-next-line max-len
    let progressPercent = this.videoPlayerService.calcPercent(this.videoPlayerService.videoEle.currentTime, this.videoTimesheetService.totalDuration);
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
