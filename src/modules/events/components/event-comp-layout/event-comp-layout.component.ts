import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IEventComp } from '@typings/event';

@Component({
  selector: 'app-event-comp-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-comp-layout.component.html',
  styleUrls: ['event-comp-layout.component.scss'],
})
export class EventCompLayoutComponent implements OnInit {
  @Input() eventSlug!: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  @Input() set EventComps(comps: IEventComp[]) {
    this.eventComps = (comps || []).map(comp => {
      if (!comp.hasOwnProperty('shown') || comp.shown === null) {
        comp.shown = true;
      }
      if (!comp.hasOwnProperty('teams') || comp.teams === null) {
        comp.teams = [];
      }
      if (!comp.hasOwnProperty('draw') || comp.draw === null) {
        comp.draw = [];
      }

      return comp;
    });
  }

  public eventComps: IEventComp[] = [];

  constructor() {}
  ngOnInit() {

  }
}
