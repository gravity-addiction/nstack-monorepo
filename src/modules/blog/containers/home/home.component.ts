import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActionCtrlService } from '@modules/app-common/services/index';
import { BlogService } from '@modules/blog/services/index';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ResultsPost } from '@typings/blog';

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
    private blogService: BlogService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loading = true;
    this.subscriptions.add(
      this.blogService.getPosts().pipe(
        tap(() => {
          this.loading = false;
        }),
        tap(p => {
          this.posts = p;
        }),
        tap(() => {
          this.changeDetectorRef.detectChanges();
        })
      ).subscribe()
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() {
    this.actionCtrl.navLoading = false;
  }
}
