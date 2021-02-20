import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-event-admin-page-history',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-admin-page-history.component.html',
  styleUrls: ['event-admin-page-history.component.scss'],
})
export class EventAdminPageHistoryComponent {
  @Input() eventSlug = '';
  @Input() pageHistory$!: Observable<any[]>;
  @Output() openPage: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }
}
