import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '@modules/app-config/config.service';
import { Observable } from 'rxjs';

import { Event, IEventVideoQueue } from '@typings/event';

@Injectable({
  providedIn: 'root',
})
export class EventsVideoService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  getPostUrl(eventId: string, filename: string, content: string, info: any = {}) {
    return this.http.post<any>(
      this.configService.config.apiPath + '/events/' + encodeURIComponent(eventId) + '/request-post',
      Object.assign({}, info, { filename, content }),
      { responseType: 'text' as any }
    );
  }

  getVideoQueueForUser(eventId: string) {
    return this.http.get<IEventVideoQueue[]>(
      this.configService.config.apiPath + '/events/' + encodeURIComponent(eventId) + '/video-queue'
    );
  }
}
