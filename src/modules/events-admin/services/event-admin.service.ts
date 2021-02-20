import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '@modules/app-config/index';
import { map } from 'rxjs/operators';

@Injectable()
export class EventAdminService {
constructor(
  private configService: ConfigService,
  private http: HttpClient
) {}

  fetchHtmlPage(url: string) {
    return this.http.get(url, { observe: 'response', responseType: 'text' }).pipe(
      map(d => d.body)
    );
  }

  getHtmlPage(shortId: string, page: string) {
    return this.http.get(this.configService.config.apiPath + '/events/' + encodeURIComponent(shortId) +
                        '/pages?page=' + encodeURIComponent(page), { observe: 'response', responseType: 'text' }).
    pipe(
      map(d => d.body)
    );
  }

  getHtmlPageId(shortId: string, id: number) {
    return this.http.get(this.configService.config.apiPath + '/events/' + encodeURIComponent(shortId) +
                        '/pages?id=' + encodeURIComponent(id.toString()), { observe: 'response', responseType: 'text' }).
    pipe(
      map(d => d.body)
    );
  }

  getHtmlPageHistory(shortId: string, page: string) {
    return this.http.get(this.configService.config.apiPath + '/events/' + encodeURIComponent(shortId) +
                        '/pages-history?page=' + encodeURIComponent(page));
  }

  saveHtmlPage(shortId: string, page: string, content: string) {
    return this.http.put(this.configService.config.apiPath + '/events/' + encodeURIComponent(shortId) +
                        '/pages', { page, content });
  }


  addEventTeam(eventSlug: string, compId: number, teamInfo: any) {
    teamInfo.compId = compId;
    return this.http.post(this.configService.config.apiPath + '/events/' + encodeURIComponent(eventSlug) +
                        '/teams', teamInfo);
  }
}
