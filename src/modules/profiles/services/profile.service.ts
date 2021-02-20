import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '@modules/app-config/config.service';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ResultsProfile } from '@typings/profile';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  profileSearch$!: Observable<any | null>;
  profileSearching = false;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  getProfile$(profileSlug: string): Observable<ResultsProfile | null> {
    return this.http.get<ResultsProfile>(
      this.configService.config.apiPath + '/profile/' + encodeURIComponent(profileSlug)
    ).pipe(map(profile => profile as ResultsProfile));
  }

  searchProfile$(keywords: string): Observable<Array<any> | null> {
    const params = new HttpParams().set('keywords', keywords);

    this.profileSearching = true;

    return this.http.get<Array<any>>(
      this.configService.config.apiPath + '/profile/search',
      { params }
    ).pipe(
      map(profile => profile),
      finalize(() => {
        this.profileSearching = false;
      })
    );
  }
}
