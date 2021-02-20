import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ActionCtrlService } from '@modules/app-common/services/index';
import { BlogService } from '@modules/blog/services/index';
import { Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { ResultsPost } from '@typings/blog';

@Component({
  selector: 'app-post',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './post.component.html',
  styleUrls: ['post.component.scss'],
})
export class PostComponent implements OnInit, OnDestroy, AfterViewInit {
  static id = 'PostComponent';

  subscriptions: Subscription = new Subscription();
  postSlug!: string;
  post!: ResultsPost;

  constructor(
    public actionCtrl: ActionCtrlService,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService
  ) { }

  ngOnInit() {

    this.subscriptions.add(
      this.route.paramMap.pipe(
        tap((params: ParamMap) => (this.postSlug = params.get('post') as string)),
        switchMap((params: ParamMap) => this.blogService.getPost(params.get('post') as string)),
        tap((post: any) => {
          this.post = post;
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

  editPost() {
    this.router.navigateByUrl('/blog/' + encodeURIComponent(this.postSlug) + '/edit');
  }
}
