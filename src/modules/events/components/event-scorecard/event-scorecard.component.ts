// eslint-disable-next-line max-len
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FsScoringClass } from '@classes/sdob-scoring/fs-scoring.class';
// import { ActionCtrlService } from '@modules/app-common/services';
import { ConfigService } from '@modules/app-config/config.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { TokenService } from '@modules/auth/services/token.service';
import { VideoService } from '@modules/video/services/video.service';
import { VideoPlayerService } from '@modules/video/services/video-player.service';
import { from, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { EventsVideoService, EventVideoQueueService, EventVideoScorecardService, EventVideoTimesheetService } from '../../services';

// import { VideoSettingsSelectCtrl, VideoTimesheetEditPointCtrl } from '../../modals';

import { IEventVideoQueue, IEventVideoScorecard } from '@typings/event';
import { IUser } from '@typings/user';

@Component({
  selector: 'app-event-scorecard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-scorecard.component.html',
  styleUrls: ['./event-scorecard.component.scss'],
})
export class EventScorecardComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() eventSlug!: string;
  @Input() videoInfo!: any;

  @Input() set videoTimesheet(v: EventVideoTimesheetService) {
    this.videoTimesheetService = v;
  }

  @Input() set videoPlayer(v: VideoPlayerService) {
    this.videoPlayerService = v;

    if (!this.videoPlayerService || !this.videoPlayerService.videoEle) {
      return;
    }

    this.videoPlayerService.videoEle.addEventListener('loadeddata', this.onVideoLoaded);
    if (this.videoPlayerService.videoEle.readyState >= 3) {
      this.setupStyles();
    }
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  @Output() PlayFile: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('VideoTimesheetElem', { static: false }) videoTimesheetElem!: ElementRef;

  public videoPlayerService!: VideoPlayerService;
  public videoTimesheetService!: EventVideoTimesheetService;

  public presetKeys: any = [];
  public timingPresets: any;
  public settingsSelection!: any;
  public scorecardName = 'Anonymous';
  public clearBtnTxt = 'Clear';
  public userInfo!: IUser;
  public videoInfractions!: string[];

  public isSaving = false;
  public isScoreSaved = false;
  public saveSub: Subscription = new Subscription();

  public totalScore = 0;
  public pointsInTime = 0;

  public setPenalty = false;
  public penaltyAmt = -1;
  public penaltyPercent = -20;
  public penaltyReason = '';

  private subscriptions: Subscription = new Subscription();

  constructor(
    // public actionCtrl: ActionCtrlService,
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    public configService: ConfigService,
    private evsService: EventVideoScorecardService,
    public evService: EventsVideoService,
    public evqService: EventVideoQueueService,
    private tokenService: TokenService,
    public videoService: VideoService
    // private videoSettingsSelectCtrl: VideoSettingsSelectCtrl,
    // public videoTimesheetEditPointCtrl: VideoTimesheetEditPointCtrl
  ) {
    this.timingPresets = this.configService.config.videoTimesheetSettings;
    this.presetKeys = Object.keys(this.timingPresets);
    this.videoInfractions = this.configService.config.videoInfractions || [];

    // Auth Refreshed
    this.subscriptions.add(
      this.authService.authRefreshed$.pipe(
        tap(() => {
          this.userInfo = this.tokenService.getActiveJson();
          this.scorecardName = this.userInfo.name || 'Anonymous';
        })
      ).subscribe()
    );
  }


  @HostListener('window:resize', ['$event'])
  @HostListener('fullscreenchange', ['$event'])
  @HostListener('webkitfullscreenchange', ['$event'])
  @HostListener('mozfullscreenchange', ['$event'])
  @HostListener('MSFullscreenChange', ['$event'])
  @HostListener('window:resize', ['$event'])
  handleResizeEvent(event: any) {
    this.setupStyles();
  }


  ngOnInit() {
    this.subscriptions.add(
      this.videoTimesheetService.marks$.pipe(
        tap((marks: any) => {

          this.totalScore = FsScoringClass.calculateScore(marks);
          this.pointsInTime = FsScoringClass.calculatePit(marks);

          this.changeDetectorRef.detectChanges();
        })
      ).subscribe()
    );
  }

  ngAfterViewInit() {
    this.setupStyles();
    if (this.userInfo) {
      this.scorecardName = this.userInfo.name || 'Anonymous';
      this.changeDetectorRef.detectChanges();
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    // this.saveSub.unsubscribe();
  }

  setupStyles() {

  }

  addPoint(cls = 'point') {
    if (this.isSaving) {
      return;
    }
    this.evsService.addPoint({ player: this.videoPlayerService, timehseet: this.videoTimesheetService }, cls);
  }

  editPoint(event: any, i: number, pointClass: string) {
    if (this.isSaving) {
      return;
    }
    if (this.videoTimesheetService.markSelected === i) {
      // this.videoTimesheetService.removeMark(i);
      this.videoTimesheetService.markSelected = -1;
    } else {
      this.videoTimesheetService.markSelected = i;
    }
  }

  removePoint(event: any, i: number) {
    if (this.isSaving) {
      return;
    }
    this.videoTimesheetService.removeMark(i);
  }

  editMarkReason(event: any, i: number, reason?: string) {
    if (this.isSaving) {
      return;
    }
    if (reason) {
      this.videoTimesheetService.editMarkReason(i, reason);
      return;
    }

    // Loop to next Infraction
    const fractList = this.configService.config.videoInfractions || [];
    const curReason = (this.videoTimesheetService.markList[i] || {}).reason || '';
    let prevI = -1;
    if (curReason) {
      prevI = fractList.findIndex((fract: string) => fract === curReason);
    }
    let newI = prevI + 1;
    if (newI > fractList.length) {
      newI = 0;
    }
    this.videoTimesheetService.editMarkReason(i, fractList[newI]);
  }

  penaltyClick(event: any) {
    this.setPenalty = true;
  }

  updatePenaltyPercent() { }

  updatePenaltyAmt() {
    this.penaltyAmt = this.totalScore * ((100 + this.penaltyPercent) / 100);
  }

  saveClick(event: any) {
    if (this.isSaving) {
      alert('Currently Saving Score'); return;
    }
    this.isSaving = true;
    const tsInfo: IEventVideoScorecard = Object.assign(
      this.videoTimesheetService.getSaveObject(),
      { name: this.scorecardName }
    );
    this.saveSub.add(
      this.evsService.saveEventEventVideoScorecard(this.eventSlug, this.videoInfo.id, tsInfo).pipe(
        tap(() => {
          this.isSaving = false;
          this.cleanAll();
          this.videoPlayerService.destroyPlayer();
          this.isScoreSaved = true;
          this.evqService.videoQueue.next(null);
        }),
        switchMap((data: any) => this.evService.getVideoQueueForUser(this.eventSlug)),
        tap((resp: IEventVideoQueue[]) => {
          this.evqService.videoQueue.next(resp);
          let foundQueue = 0;
          let qI = 0;
          while (foundQueue === 0 && qI < resp.length) {
            if (resp.length && (resp[qI].queue || []).length) {
              this.PlayFile.emit(resp[qI].queue[qI]);
              foundQueue = 1;
            }
            qI++;
          }
          this.changeDetectorRef.detectChanges();
        }),
        catchError((err: any) => {
          this.isSaving = false;
          this.changeDetectorRef.detectChanges();
          return err;
        })
      ).subscribe()
    );
  }

  clearClick(event: any) {
    this.clearBtnTxt = 'Dbl Click';
    setTimeout(() => {
      this.clearBtnTxt = 'Clear';
    }, 4000);
  }

  clearDblClick(event: any) {
    this.clearBtnTxt = 'Clear';
    this.cleanAll();
    this.cleanSaveSub();
  }

  cleanAll() {
    this.cleanTimesheet();
    this.cleanWorkingTime();
    this.isSaving = false;
    this.isScoreSaved = false;
  }

  cleanSaveSub() {
    this.saveSub.unsubscribe();
    this.saveSub = new Subscription();
  }

  cleanTimesheet() {
    this.videoTimesheetService.clearMarks();
  }

  cleanWorkingTime() {
    this.videoTimesheetService.clearWorkingTime();
  }

  private onVideoLoaded = () => {
    this.cleanAll();
    this.setupStyles();
  };

}
