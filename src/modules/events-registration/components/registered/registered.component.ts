// eslint-disable-next-line max-len
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-events-registered',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './registered.component.html',
  styleUrls: ['registered.component.scss'],
})
export class EventsRegisteredComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() eventSlug!: string;
  @Input() regCode!: string;
  @Input() event!: any;
  @Input() eventReg!: any;
  @Output() changedHeight = new EventEmitter<boolean>();

  private subscriptions: Subscription = new Subscription();

  constructor() { }

  ngOnInit() { }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() { }




}
