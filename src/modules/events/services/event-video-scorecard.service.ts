import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '@modules/app-config/config.service';
import { VideoPlayerService } from '@modules/video/services/index';
import { Observable } from 'rxjs';

import { IEventVideoQueue } from '@typings/event';

@Injectable({
  providedIn: 'root',
})
export class EventVideoScorecardService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  addPoint(videoplayer: any, cls = 'point', score = 1) {
    // eslint-disable-next-line max-len
    const markDelayCompensation = videoplayer.timesheet.markDelayCompensation * (
        (videoplayer.player.videoEle.paused) ? 0 : videoplayer.player.videoEle.playbackRate
    );
    videoplayer.timesheet.addMark(videoplayer.player.videoEle.currentTime - markDelayCompensation, cls, score);
  }


  saveEventEventVideoScorecard(eventId: string, videoId: number, scCard: any): Observable<any> {
    return this.http.put<any>(
      this.configService.config.apiPath + '/events/' + encodeURIComponent(eventId) + '/scores/' + encodeURIComponent(videoId),
      scCard
    );
  }

  getEventEventVideoScorecard(eventSlug: string, videoId: number, cardQuery?: string): Observable<any> {
    return this.http.get<IEventVideoQueue[]>(
      this.configService.config.apiPath + '/events/' + encodeURIComponent(eventSlug) + '/scores/' + encodeURIComponent(videoId) +
      ((cardQuery) ? '?query=' + encodeURIComponent(cardQuery) : '')
    );
  }

  getTeamEventVideoScorecard(eventSlug: string, teamId?: number, round?: number): Observable<any> {
    const query: any = { query: 'official' };
    if (teamId) {
 query.team = teamId;
}
    if (round) {
 query.rnd = round;
}

    const params: HttpParams = new HttpParams({fromObject: query});
    return this.http.get<IEventVideoQueue[]>(
      this.configService.config.apiPath + '/events/' + encodeURIComponent(eventSlug) + '/scores',
      { params }
    );
  }
}
