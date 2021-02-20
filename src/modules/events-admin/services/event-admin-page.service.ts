import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({providedIn: 'root'})
export class EventAdminPageService {
  eventHtml = '';
  showEditor = false;
  shownUrl = '';
  eventPage = '';

  pageHistory: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  pageHistory$: Observable<any[]> = this.pageHistory.asObservable();

  constructor() {}

  setPage(url: string) {
    this.shownUrl = url;
    this.eventPage = url.replace('assets/event-pages/', '');
  }

}
