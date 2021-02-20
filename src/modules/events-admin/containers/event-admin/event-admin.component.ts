import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActionCtrlService } from '@modules/app-common/services/index';
import { Subscription } from 'rxjs';

import { EventAdminPageService } from '../../services';

@Component({
  selector: 'app-event-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-admin.component.html',
  styleUrls: ['event-admin.component.scss'],
})
export class EventAdminComponent implements OnInit, OnDestroy, AfterViewInit {
  subscriptions: Subscription = new Subscription();
  loading = true;

  constructor(
    public actionCtrl: ActionCtrlService,
    public eapService: EventAdminPageService
  ) {

  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.actionCtrl.navLoading = false;
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() {
    this.loading = false;
  }

}
