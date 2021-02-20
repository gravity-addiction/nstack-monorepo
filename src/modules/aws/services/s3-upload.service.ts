import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { ConfigService } from '@modules/app-config/config.service';
import { BehaviorSubject, Observable, ObservableInput, Subject, Subscription, throwError } from 'rxjs';
import { catchError, finalize, takeUntil, tap } from 'rxjs/operators';

export enum AwsS3UploadStatus {
  IDLE,
  RUNNING,
  FINISHED,
  ERROR,
}

@Injectable({ providedIn: 'root' })
export class S3UploadService implements OnDestroy {

  public uploadQueue: any[] = [];
  public putObserve!: Observable<any>;
  public uploadStatus: BehaviorSubject<any> = new BehaviorSubject({status: 0});

  public canUpload = true;
  public withProgress = true;
  public withAvgBitrate = 0; // number of transfer packets to consider

  public currentTransferRate = 0;

  private subscriptions: Subscription = new Subscription();

  private _bitTraffic: any[] = [];
  private _lastBitCalc = 0;

  constructor(
    private configService: ConfigService,
    private http: HttpClient
  ) { }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getPostUrl(filename: string, content: string, info: any = {}) {
    return this.http.post<any>(
      this.configService.config.apiPath + '/aws/request-post',
      { filename, content, info },
      { responseType: 'text' as any }
    );
  }

  confirmPost(filename: string, content: string, formdata: any) {
    const postData = {
      filename,
      content,
      formdata,
    };

    const postParams = new HttpParams({ fromObject: postData });
    return this.http.post<any>(this.configService.config.apiPath + '/aws/request-post', postParams, { observe: 'response' });
  }

  addFileToQueue(url: string, content: string, file: File, meta?: any) {
    const qInfo = {
      url,
      fType: content,
      f: file,
      cancel$: new Subject(),
      done$: new Subject(),
      meta,
    };
    this.uploadQueue.push(qInfo);
    // console.log('Added to Queue', qInfo);
    this.findNextReady();
    return qInfo;
  }

  findNextReady() {
    if (this.putObserve || !this.canUpload) {
      // console.log('Not Ready to Upload');
      return;
    }

    const qI = this.uploadQueue.findIndex(q => !q.started);
    if (qI > -1) {
      // console.log('Moving to Next in Queue');
      this.uploadQueue[qI].progress = (this.withProgress) ? 0 : -1;
      this.uploadNext(this.uploadQueue[qI]);
    } else {
      // console.log('Upload Status Idle');
      this.uploadStatus.next({status: AwsS3UploadStatus.IDLE, queue: null});
    }
  }

  uploadNext(queueInfo: any) {
    const url = queueInfo.url;
    const fType = queueInfo.fType;
    const f = queueInfo.f;

    queueInfo.started = true;
    this.uploadStatus.next({status: AwsS3UploadStatus.RUNNING, queue: queueInfo, progress: 0});

    this.subscriptions.add(
      this.putFile(url, fType, f, (queueInfo.progress > -1)).
      pipe(takeUntil(queueInfo.cancel$)).
      pipe(
        tap((event: any) => {
          // Standard Upload Progression
          if (queueInfo.progress !== -1 && event.type === HttpEventType.UploadProgress) {
            const eLoaded = event.loaded || 0;
                  const eTotal = event.total || 0;
            const prog = (eLoaded / eTotal);
            queueInfo.progress = prog;
            if (this.withAvgBitrate) {
 this.averageBitRate(eLoaded, this.withAvgBitrate);
}
            this.uploadStatus.next({status: AwsS3UploadStatus.RUNNING, queue: queueInfo, progress: prog, loaded: eLoaded, total: eTotal });

          // Got Response Headers
          } else if (queueInfo.progress !== -1 && event.type === HttpEventType.ResponseHeader) {


          // Finished Uploading
          } else if (queueInfo.progress !== -1 && event.type === HttpEventType.Response) {
            queueInfo.finished = true;
            this.uploadStatus.next({status: AwsS3UploadStatus.FINISHED, queue: queueInfo, body: event.body});

          // User Interrupted
          } else if (queueInfo.progress !== -1 && event.type === HttpEventType.User) {
            queueInfo.interupted = true;
            this.uploadStatus.next({status: AwsS3UploadStatus.ERROR, queue: queueInfo, err: 'User Interrupt'});
            queueInfo.cancel$.next('User Interrupt');

          // Totally Finished
          } else if (queueInfo.progress === -1) {
            queueInfo.finished = true;
            queueInfo.progress = 1;
            this.uploadStatus.next({status: AwsS3UploadStatus.FINISHED, queue: queueInfo, body: event});
          }
        }),
        catchError((err: any, caught: Observable<any>): ObservableInput<any> => {
          queueInfo.err = err;
          this.uploadStatus.next({status: AwsS3UploadStatus.ERROR, queue: queueInfo, err});
          return throwError(err);
        }),
        finalize(() => {
          queueInfo.finished = true;
          this.uploadStatus.next({status: AwsS3UploadStatus.FINISHED, queue: queueInfo});
          queueInfo.done$.complete();
          this.findNextReady();
        })
      ).subscribe()
    );
  }

  putFile(url: string, content: string, file: File, withProgress = true): Observable<any> {
    const headers = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': content,
    });
    let opts = { headers };
    if (withProgress) {
      opts = { ...opts, ...{ reportProgress: true, observe: 'events'} };
    }
    return this.http.put(url, file, opts);
  }

  averageBitRate(size: number, keep: number = 10) {
    const nowTime = new Date().getTime();
    // if (nowTime - this._lastBitCalc < 1000) { return; } // Throttle
    this._lastBitCalc = nowTime;
    this._bitTraffic.push({
      t: nowTime,
      s: size,
    });

    let sliceS = this._bitTraffic.length - keep;
    if (sliceS < 0) {
 sliceS = 0;
}
    this._bitTraffic = this._bitTraffic.slice(sliceS, this._bitTraffic.length);
    const sT: any = this._bitTraffic[0];
    const eT: any = this._bitTraffic[this._bitTraffic.length - 1];
    const rate = ((eT.s - sT.s) / (eT.t - sT.t) * 1000) || 0;
    this.currentTransferRate = rate;
    // console.log('TR:', rate);
  }
}
