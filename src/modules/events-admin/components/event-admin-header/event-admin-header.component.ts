import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-event-admin-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-admin-header.component.html',
  styleUrls: ['event-admin-header.component.scss'],
})
export class EventAdminHeaderComponent {

  constructor() { }
}
