// eslint-disable-next-line max-len
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActionCtrlService } from '@modules/app-common/services/action-ctrl.service';
import { ConfigService } from '@modules/app-config/config.service';
import { VideoPlayerService } from '@modules/video/services/index';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { EventsVideoService, EventVideoScorecardService, EventVideoTimesheetService } from '../../services/index';

// import { VideoSettingsSelectCtrl, VideoTimesheetEditPointCtrl } from '../../modals/index';


@Component({
  selector: 'app-event-scoresheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-scoresheet.component.html',
  styleUrls: ['./event-scoresheet.component.scss'],
})
export class EventScoresheetComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() scoreSheets!: any;
  @Input() videoPlayerService!: VideoPlayerService;

  public markSelected = -1;
  public videoSettings: any = {};

  private subscriptions: Subscription = new Subscription();

  constructor(
    public actionCtrl: ActionCtrlService,
    private changeDetectorRef: ChangeDetectorRef,
    public configService: ConfigService,
    public evService: EventsVideoService
  ) {

  }

  ngOnInit() {
    this.videoSettings = this.configService.config.videoTimesheetSettings.fs;
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  videoGoto(item: any) {
    if (!this.videoPlayerService) {
      return;
    }
    this.videoPlayerService.videoGoto(item.time);
  }
}
