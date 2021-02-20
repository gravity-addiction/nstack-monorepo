import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { EventsService } from '../../services';

import { Event } from '@typings/event';

@Component({
  selector: 'app-events-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  loading = true;
  events!: Event[] | null;

  constructor(
    private eventsService: EventsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loading = true;

    this.subscription.add(
      this.eventsService.getEvents().pipe(
        tap(() => {
 this.loading = false;
}),
        tap(r => {
 this.events = r;
}),
        tap(() => {
 this.changeDetectorRef.detectChanges();
})
      ).subscribe()
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
