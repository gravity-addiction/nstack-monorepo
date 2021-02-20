import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '@modules/app-config/config.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AwsCtrlService {
  public bucketList: any[] = [];

  constructor(
    private configService: ConfigService,
    private http: HttpClient
  ) { }

  getAwsInfo() {
    return this.http.get(this.configService.config.apiPath + '/aws/home');
  }

  getAwsKey() {
    return this.http.get(this.configService.config.apiPath + '/aws/key');
  }

  getAwsKeySecret(key: string) {
    const params = new HttpParams().set('key', key);
    return this.http.get(this.configService.config.apiPath + '/aws/key-secret', { params });
  }

  setupCloudStorage() {
    return this.http.post(this.configService.config.apiPath + '/aws/home', {});
  }


  lsFolder(server: string, bucket: string, key: string = '', max: string = '0', continueKey = '') {
    const query: any = {
      server,
      bucket,
    };
    if (key) {
      query.key = key;
    }
    if (max) {
      query.max = max;
    }
    if (continueKey) {
      query.continue = continueKey;
    }

    const params = new HttpParams({ fromObject: query });
    return this.http.get(this.configService.config.apiPath + '/aws/ls', { params });
  }

  lsFolderVideo(server: string, bucket: string, key: string = '', max: string = '0', continueKey = '') {
    const query: any = {
      server,
      bucket,
    };
    if (key) {
      query.key = key;
    }
    if (max) {
      query.max = max;
    }
    if (continueKey) {
      query.continue = continueKey;
    }

    const params = new HttpParams({ fromObject: query });
    return this.http.get(this.configService.config.apiPath + '/aws/ls-video', { params });
  }

  lsBuckets() {
    return this.http.get(this.configService.config.apiPath + '/aws/ls-buckets').pipe(
      map((buckets: any) => {
        const bList = (buckets || {}).Buckets || [];
        const bLen = bList.length;
        for (let b = 0; b < bLen; b++) {
          const newBucket = {
            id: bList[b].Name,
            cloudfront: (bList[b].Name === 'sdob-videos'),
          };
          this.bucketList.push(newBucket);
        }
        return buckets;
      })
    );
  }

  getBucket(id: string) {
    return this.bucketList.find(b => b.id === id);
  }

  updateBucket(bucket: any) {
    const obI = this.bucketList.findIndex(b => b.id === bucket.id);
    if (obI > -1) {
      const bucketObj = Object.keys(bucket);
      const bucketLen = bucketObj.length;
      for (let b = 0; b < bucketLen; b++) {
        this.bucketList[b] = bucketObj[b];
      }
    } else {
      this.bucketList.push(bucket);
    }
  }
}
