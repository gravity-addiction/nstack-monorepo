import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { IEventVideoQueue } from '@typings/event';

@Injectable({
  providedIn: 'root',
})
export class EventVideoQueueService {

  videoQueue: BehaviorSubject<IEventVideoQueue[] | null> = new BehaviorSubject<IEventVideoQueue[] | null>(null);
  videoQueue$ = this.videoQueue.asObservable();

  constructor() { }

}
