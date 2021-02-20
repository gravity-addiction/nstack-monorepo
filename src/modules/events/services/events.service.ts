import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '@modules/app-config/config.service';
import { Observable } from 'rxjs';

import { Event } from '@typings/event';

@Injectable({
  providedIn: 'root',
})
export class EventsService {

  public events: any;
  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  getEvents(): Observable<Event[] | null> {
    return this.http.get<Event[]>(this.configService.config.apiPath + '/events');
  }

  getEvent(shortId: string): Observable<Event | null> {
    return this.http.get<Event>(this.configService.config.apiPath + '/events/' + encodeURIComponent(shortId) );
  }

  getEventsWithComps(eventSlug: string): Observable<any[] | null> {
    return this.http.get<any[]>(this.configService.config.apiPath + '/events/' + encodeURIComponent(eventSlug) + '/comps' );
  }

  updateEvent(shortId: string, post: any) {
    return this.http.put(this.configService.config.apiPath + '/events/' + encodeURIComponent(shortId), new HttpParams({fromObject: post}));
  }

  addRegistration(event: string, info: any): Observable<any[]> {
    return this.http.post<any>(
      this.configService.config.apiPath + '/events/' + encodeURIComponent(event) + '/registration.json',
      new HttpParams({fromObject: info})
    );
  }

  getRegistration(event: string, id: string): Observable<any[]> {
    return this.http.get<any>(this.configService.config.apiPath + '/events/' + encodeURIComponent(event) +
                              '/registration/' + encodeURIComponent(id));
  }

  getRegistrationCount(event: string): Observable<any[]> {
    return this.http.get<any>(this.configService.config.apiPath + '/events/' + encodeURIComponent(event) + '/counts.json');
  }

  getEventRegistrations(event: string): Observable<any[]> {
    return this.http.get<any>(this.configService.config.apiPath + '/events/' + encodeURIComponent(event) + '/registrations.json');
  }

  runPayment(nonce: string, event: string, shortId: string, amount: number): Observable<any> {
    const params = new HttpParams().
                    set('nonce', nonce).
                    set('event', event).
                    set('short_id', shortId).
                    set('amount', (amount || 0).toString());
    return this.http.post<any>(this.configService.config.apiPath + '/events/' + encodeURIComponent(event) + '/payment.json',
                                params);
  }

  getVideoPostUrl(event: string, shortId: string, discipline: string, filename: string, content: string, formdata: any) {
    const params = new HttpParams().
                    set('short_id', shortId).
                    set('filename', filename).
                    set('content', content).
                    set('formdata', formdata);
    return this.http.post<any>(this.configService.config.apiPath + '/event/' + encodeURIComponent(event) + '/request-post',
                                params, { observe: 'response' });
  }

  confirmVideoPost(event: string, shortId: string, discipline: string) {
    const params = new HttpParams().
                    set('short_id', shortId).
                    set('discipline', discipline);
    return this.http.put<any>(this.configService.config.apiPath + '/event/' + encodeURIComponent(event) + '/confirm-post',
                              params, { observe: 'response' });
  }
}
