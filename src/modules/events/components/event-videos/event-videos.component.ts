// eslint-disable-next-line max-len
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';

import { EventVideosGroupComponent } from '../event-videos-group/event-videos-group.component';

import { IEventVideoQueue } from '@typings/event';

@Component({
  selector: 'app-event-videos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-videos.component.html',
  styleUrls: ['event-videos.component.scss'],
})
export class EventVideosComponent implements OnInit {
  @Input() videos$!: Observable<IEventVideoQueue[]>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  @Output() PlayFile: EventEmitter<any> = new EventEmitter();
  @ViewChild('PageTop', { static: false }) pageTop!: ElementRef;
  @ViewChildren(EventVideosGroupComponent) eventGroups!: QueryList<EventVideosGroupComponent>;

  constructor() {}
  ngOnInit() {}

  emitPlayFile(vInfo: IEventVideoQueue) {
    this.PlayFile.emit(vInfo);
  }

  scrollToTop() {
    this.pageTop.nativeElement.scrollIntoView({});
  }

  scrollToVGroup(vGi: number) {
    const elGroup: EventVideosGroupComponent[] = this.eventGroups.filter((cls, ind) => ind === vGi);
    if (elGroup.length) {
      elGroup[0].groupTop.nativeElement.scrollIntoView({});
    }
  }
}
