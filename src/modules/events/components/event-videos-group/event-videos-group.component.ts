// eslint-disable-next-line max-len
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { EventVideoScorecardService } from '../../services';

import { IEventVideoQueue, IEventVideoQueueEntry } from '@typings/event';

@Component({
  selector: 'app-event-videos-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-videos-group.component.html',
  styleUrls: ['event-videos-group.component.scss'],
})
export class EventVideosGroupComponent implements OnInit {
  @Input() vGroup!: IEventVideoQueue;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  @Output() PlayFile: EventEmitter<IEventVideoQueue> = new EventEmitter();
  // eslint-disable-next-line @typescript-eslint/naming-convention
  @Output() ScrollToTop: EventEmitter<void> = new EventEmitter();

  @ViewChild('GroupTop', { static: false }) groupTop!: ElementRef;

  private subscriptions: Subscription = new Subscription();
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private evsService: EventVideoScorecardService
  ) {}

  ngOnInit() {}

  emitPlayFile(vInfo: IEventVideoQueue) {
    this.PlayFile.emit(vInfo);
  }

  scrollTop() {
    this.ScrollToTop.emit();
  }

  fetchScores(qVideo: IEventVideoQueueEntry) {
    qVideo.loadScores = true;
    this.subscriptions.add(
      this.evsService.getEventEventVideoScorecard('admin', qVideo.id).pipe(
        tap((data: any) => {
          qVideo.scores = data;
          qVideo.loadScores = false;

          this.changeDetectorRef.detectChanges();
        }),
        catchError((_err: any) => {
          qVideo.loadScores = false;
          throw _err;
        })
      ).subscribe()
    );
  }
}
