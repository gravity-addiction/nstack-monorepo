import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AwsCtrlService } from '../../services';

@Component({
  selector: 'app-aws-admin-main',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './aws-admin-main.component.html',
  styleUrls: ['aws-admin-main.component.scss'],
})
export class AwsAdminMainComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  constructor(
    private awsCtrlService: AwsCtrlService
  ) { }

  ngOnInit() { }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setupHome() {
    this.subscriptions.add(
      this.awsCtrlService.setupCloudStorage().subscribe((data: any) => {
        console.log('home created: ', data);
      })
    );
  }

  createKey() {
    this.subscriptions.add(
      this.awsCtrlService.getAwsKey().subscribe((data: any) => {
        console.log('key: ', data);
      })
    );
  }
}
