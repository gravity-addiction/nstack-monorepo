import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '@modules/app-config/config.service';
import { BehaviorSubject } from 'rxjs';

import { IEventVideoQueue } from '@typings/event';

@Injectable({
  providedIn: 'root',
})
export class VideoQueueService {

  videoQueue: BehaviorSubject<IEventVideoQueue[] | null> = new BehaviorSubject<IEventVideoQueue[] | null>(null);
  videoQueue$ = this.videoQueue.asObservable();

  constructor(
    private configService: ConfigService,
    private http: HttpClient
  ) { }

  getVideoQueueList() {
    return this.http.get(this.configService.config.apiPath + '/video-queue');
  }

  addSpliceArray(videoQueueId: number, spliceEvent: string, spliceTime: number) {
    return this.http.put(
      this.configService.config.apiPath + '/video-queue/' + encodeURIComponent(videoQueueId) + '/splice',
      { spliceEvent, spliceTime }
    );
  }

  getSpliceArray(videoQueueId: number, spliceEvent: string, spliceTime: number) {
    return this.http.get(this.configService.config.apiPath + '/video-queue/' + encodeURIComponent(videoQueueId) + '/splice');
  }

}
