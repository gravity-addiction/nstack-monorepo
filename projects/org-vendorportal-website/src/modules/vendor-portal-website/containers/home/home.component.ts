import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActionCtrlService } from '@modules/app-common/services/index';
import { ResultsPost } from '@typings/blog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  subscriptions: Subscription = new Subscription();

  loading = true;
  posts!: ResultsPost[] | null;

  constructor(
    public actionCtrl: ActionCtrlService,
  ) { }

  ngOnInit() {
    this.loading = true;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() {
    this.actionCtrl.navLoading = false;
  }
}
