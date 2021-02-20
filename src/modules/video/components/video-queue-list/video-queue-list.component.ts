// eslint-disable-next-line max-len
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { VideoQueueService, VideoService } from '../../services/index';

import { IVideoQueue } from '@typings/video';

@Component({
  selector: 'app-video-queue-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './video-queue-list.component.html',
  styleUrls: ['video-queue-list.component.scss'],
})
export class VideoQueueListComponent implements OnInit, OnDestroy {
  @Input() videoQueueListArr!: IVideoQueue[];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  @Output() PlayFile: EventEmitter<any> = new EventEmitter<any>();

  private subscriptions: Subscription = new Subscription();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private videoQueueService: VideoQueueService,
    private videoService: VideoService
  ) {
  }
  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  playFile(videoInfo: any) {

    const vQ = Object.assign({}, videoInfo, {
      bucket: videoInfo.s3BucketSrc,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Key: videoInfo.s3KeySrc
    });
    this.PlayFile.emit(vQ);
  }


}
