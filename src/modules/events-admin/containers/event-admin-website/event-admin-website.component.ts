import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ActionCtrlService, HelperService } from '@modules/app-common/services/index';
import { S3UploadService } from '@modules/aws/services/index';
import { Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { EventAdminPageService, EventAdminService } from '../../services';

import { Event } from '@typings/event';

@Component({
  selector: 'app-event-admin-website',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-admin-website.component.html',
  styleUrls: ['event-admin-website.component.scss'],
})
export class EventAdminWebsiteComponent implements OnInit, OnDestroy, AfterViewInit {
  subscriptions: Subscription = new Subscription();

  eventSlug!: string;

  showEditor = false;
  eventHtml = '';
  shownUrl = '';
  eventPage = '';
  eventHistoryDate = '';

  saveTxt = 'Save';
  pageHistory: any[] = [];

  constructor(
    public actionCtrl: ActionCtrlService,
    private eventAdminService: EventAdminService,
    public eapService: EventAdminPageService,
    private helperService: HelperService,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    public s3UploadService: S3UploadService
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.route.paramMap.pipe(
        tap((params: ParamMap) => {
          this.eventSlug = params.get('event') as string;
        })
      ).subscribe()
    );

    this.subscriptions.add(
      this.eapService.pageHistory$.pipe(
        tap((data: any[]) => {
          this.pageHistory = data;
        })
      ).subscribe()
    );
  }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() {
    this.actionCtrl.navLoading = false;
    this.loadHtmlPage('assets/event-pages/2020_ghost_nationals/index.html');
  }

  loadHtmlPage(url: any) {
    this.eventHtml = '';
    this.eventHistoryDate = '';
    this.showEditor = false;


    // Passing string is setting a new url page
    if (typeof url === 'string') {
      this.eapService.setPage(url);

      this.subscriptions.add(
        // this.eventAdminService.fetchHtmlPage(url).pipe(
        this.eventAdminService.getHtmlPage(this.eventSlug, this.eapService.eventPage).pipe(
          tap((hTxt: any) => {
            this.eventHtml = hTxt;
            this.showEditor = true;
            this.eapService.setPage(url);
            this.changeDetectorRef.detectChanges();
          }),
          switchMap(() => this.eventAdminService.getHtmlPageHistory(this.eventSlug, this.eapService.eventPage)),
          tap((data: any) => {
            if (Array.isArray(data)) {
              this.eapService.pageHistory.next(data);
            }
          })
        ).subscribe()
      );

      // Passing number value to get history by id
    } else if (typeof url === 'number') {
      this.subscriptions.add(
        // this.eventAdminService.fetchHtmlPage(url).pipe(
        this.eventAdminService.getHtmlPageId(this.eventSlug, url).pipe(
          tap((hTxt: any) => {
            this.eventHtml = hTxt;
            const pInd = this.pageHistory.findIndex(p => p.id === url);
            if (pInd > 0) {
              this.eventHistoryDate = (this.pageHistory[pInd] || {}).datestamp || '';
            }
            this.showEditor = true;
            this.changeDetectorRef.detectChanges();
          })
        ).subscribe()
      );
    }
  }

  reloadHtml() {
    this.loadHtmlPage(this.shownUrl);
  }

  publishHtml() {
    alert('No Active Yet');
  }
  saveHtml() {
    this.saveTxt = 'Saving Page ...';
    this.eventAdminService.saveHtmlPage(this.eventSlug, this.eventPage, this.eventHtml).subscribe(
      (saveResp) => {
        this.saveTxt = 'Saved';
        this.changeDetectorRef.detectChanges();
        setTimeout(() => {
          this.saveTxt = 'Save';
        }, 3000);
      },
      (err) => {
        this.saveTxt = 'Failed';
        this.changeDetectorRef.detectChanges();
      }
    );
  }
}
