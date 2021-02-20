import { Location } from '@angular/common';
// eslint-disable-next-line max-len
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, NavigationStart, ParamMap, Router } from '@angular/router';
import { ActionCtrlService } from '@modules/app-common/services/index';
import { Observable, Subscription } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { RecordsService } from '../../services/index';

import { ResultsRecordGrouped, ResultsRecordUSPA } from '@typings/records';

@Component({
  selector: 'app-records-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('recordSubclass') subclassDiv!: QueryList<ElementRef>;
  @ViewChild('pageTop') pageTop!: ElementRef;
  @ViewChild('recordsTop') recordsTop!: ElementRef;

  subscriptions: Subscription = new Subscription();

  recordState = '';
  loadingState = true;

  records!: ResultsRecordGrouped[];

  constructor(
    public actionCtrl: ActionCtrlService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private recordsService: RecordsService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadingState = true;

    this.subscriptions.add(
      this.route.paramMap.pipe(
        tap((params: ParamMap) => (this.recordState = params.get('state') as string)),
        switchMap((params: ParamMap) =>
          this.recordsService.getRecordsByState$((params.get('state') as string) || 'national')
        ),
        tap(() => {
          this.loadingState = false;
        }),
        map((response: ResultsRecordUSPA[]): ResultsRecordGrouped[] => this.recordsService.groupRecords(response)),
        tap((r: ResultsRecordGrouped[]) => {
          this.records = r;
        }),
        tap(() => {
          this.changeDetectorRef.detectChanges();
        })
      ).subscribe()
    );
  }

  ngAfterViewInit() {
    this.actionCtrl.navLoading = false;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  stateClicked(event: Event) {
    const target: HTMLElement | null = (event.target as HTMLElement) || (event.currentTarget as HTMLElement);
    const idAttr: Attr | null = target.attributes.getNamedItem('id');
    this.recordState = idAttr ? (idAttr.nodeValue ? idAttr.nodeValue : '') : '';
    if (this.recordState === 'us-map') {
      this.recordState = 'national';
      this.location.replaceState('/r');
    } else {
      this.location.replaceState('/r/' + this.recordState);
    }

    this.records = [];
    this.loadingState = true;
    this.changeDetectorRef.detectChanges();

    this.scrollToRecordsTop();

    this.subscriptions.add(
      this.recordsService.getRecordsByState$(this.recordState).pipe(
        tap(() => {
          this.loadingState = false;
        }),
        map((r: ResultsRecordUSPA[]): ResultsRecordGrouped[] => this.recordsService.groupRecords(r)),
        tap((r: ResultsRecordGrouped[]) => {
          this.records = r;
        }),
        tap(() => {
          this.changeDetectorRef.detectChanges();
        })
      ).subscribe()
    );
  }

  scrollToTop() {
    this.pageTop.nativeElement.scrollIntoView();
  }

  scrollToSubclass(subclass: number) {
    this.subclassDiv.toArray()[subclass].nativeElement.scrollIntoView();
  }

  scrollToRecordsTop() {
    this.recordsTop.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
