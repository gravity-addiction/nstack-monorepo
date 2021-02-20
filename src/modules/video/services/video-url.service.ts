import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '@modules/app-config/config.service';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VideoUrlService {

  constructor(
    private configService: ConfigService,
    private _cookieService: CookieService,
    private http: HttpClient
  ) { }


  getVideoFFProbe(key: string) {
    return this.http.get<any>(this.configService.config.apiPath + '/aws/ffprobe', { params: { key }, observe: 'response' }).
      pipe(
        tap((resp: HttpResponse<any>) => {
          if (resp.status === 200) {
            // Change Password
            return resp.body;
          } else {
            return false;
          }
        }, (err: any) => false)
      );
  }

  getVideoUrl(key: string, bucket: string, server: string) {
    // console.log('Key', key);
    // console.log('Bucket', bucket);
    // console.log('Server', server);
    return this.http.get<string>(
      this.configService.config.apiPath + '/aws/request-url',
      { responseType: 'text' as any,
        params: {
          key,
          bucket,
          server,
        },
      }
    );
  }

  getVideoCookie(key: string, bucket: string, server: string): Observable<any> {
    try {
      const expires: number = parseInt(this._cookieService.get('CloudFront-Expires'), 10);
      if (expires > (new Date().getTime()) + 5000) {
        return of({});
      }
    } catch (e) { }

    return this.http.get<any>(
      this.configService.config.apiPath + '/aws/request-cookie',
      {
        params: {
          root: '*',
          key,
          bucket,
          server,
        },
        observe: 'response',
      }
    ).pipe(
      tap(() => {
        this._cookieService.set('CloudFront-Key-Pair-Id', this._cookieService.get('CloudFront-Key-Pair-Id'));
        this._cookieService.set('CloudFront-Policy', this._cookieService.get('CloudFront-Policy'));
        this._cookieService.set('CloudFront-Signature', this._cookieService.get('CloudFront-Signature'));
      })
    );
  }

  getVideoPostUrl(filename: string, content: string, formdata: any) {
    return this.http.post<any>(this.configService.config.apiPath + '/aws/request-post',
      { filename, content, formdata },
      { observe: 'response' }
    );
  }
}
