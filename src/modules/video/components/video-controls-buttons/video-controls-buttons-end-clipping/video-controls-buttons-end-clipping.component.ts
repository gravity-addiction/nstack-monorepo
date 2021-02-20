import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActionCtrlService } from '@modules/app-common/services/action-ctrl.service';
import { ConfigService } from '@modules/app-config/config.service';
import { BehaviorSubject } from 'rxjs';

import { VideoPlayerService, VideoQueueService } from '../../../services';

@Component({
  selector: 'app-video-controls-buttons-end-clipping',
  templateUrl: './video-controls-buttons-end-clipping.component.html',
  styleUrls: ['./video-controls-buttons-end-clipping.component.scss'],
})
export class VideoControlsButtonsEndClippingComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input()
  set videoPlayer(v: VideoPlayerService) {
    this.videoPlayerService = v;
  }

  @Input() videoPlayerData!: { vq: BehaviorSubject<any> };

  public videoPlayerService!: VideoPlayerService;
  public baseWidth = 100;
  public get wid(): number {
    const modWid = 0;
    return this.baseWidth + modWid;
  }

  constructor(
    private videoQueueService: VideoQueueService
  ) {}

  ngOnInit() {

  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {

  }

  setSlate() {
    const vq$: any = this.videoPlayerData.vq || {};
          const vq = vq$.value || '';

    const nowTime = (this.videoPlayerService.videoEle || {}).currentTime || 0;
    console.log('Slate:', nowTime, vq.id);
    this.videoQueueService.addSpliceArray(vq.id, 'slate', nowTime).subscribe();
  }

  setExit() {
    const vq$: any = this.videoPlayerData.vq || {};
          const vq = vq$.value || '';

    const nowTime = (this.videoPlayerService.videoEle || {}).currentTime || 0;
    console.log('Exit:', nowTime, vq.id);
    this.videoQueueService.addSpliceArray(vq.id, 'exit', nowTime).subscribe();
  }
}
