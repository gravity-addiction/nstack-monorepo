import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AwsCtrlService, FolderService } from '../../services';

// import { FileInfoCtrl } from '../_modals/file-info/file-info.module';

@Component({
  selector: 'app-aws-s3-file-listing',
  templateUrl: './s3-file-listing.component.html',
  styleUrls: ['./s3-file-listing.component.scss'],
})
export class S3FileListingComponent implements OnInit, OnDestroy {
  @Input() folderService!: FolderService;
  @ViewChild('FileList', { static: true }) fileListContainer!: ElementRef;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  @Output() PlayFile: EventEmitter<any> = new EventEmitter();

  public fileList: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
  public folderList!: Observable<any>;
  public selectedBucket = 'sdob-videos';

  private subscriptions: Subscription = new Subscription();

  constructor(
    private _awsCtrl: AwsCtrlService,
    private _router: Router
    // private fileInfoCtrl: FileInfoCtrl
  ) {
  }

  ngOnInit() {
    // this.folderList = this.folderService.folderList.asObservable();
    // this.folderList.subscribe(s => { console.log('FL', s); });

    this.subscriptions.add(
      this.folderService.changeFolderObs.
        pipe(
          switchMap(v => this._awsCtrl.lsFolder(
            this.folderService.shownServer, this.folderService.shownBucket, this.folderService.shownFolder, this.folderService.shownLimit
          ).pipe(
            map((d: any) => {
              if ((!d.Contents || !(d.Contents || []).length) && (!d.CommonPrefixes || !(d.CommonPrefixes || []).length)) {
                this.folderService.hasNoFiles = true;
              }
              if (!this.folderService.shownBucket) {
                this.folderService.shownBucket = d.Name || '';
              }
              if (!this.folderService.shownFolder) {
                this.folderService.shownFolder = d.Prefix || '';
              }
              this.selectedBucket = this.folderService.shownBucket;
              return d;
            }),
            catchError((err: any) => {
              if (err.status === 401) {
                this.folderService.isAccessDenied = true;
              } else {
                this.folderService.isLoadingError = true;
              }
              this.folderService.isLoadingFiles = false;
              return throwError(err);
            })
          ))
        ).subscribe(
          (data: any) => this.changingFolder(data),
          _ => this.fileList.next([])
        )
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  async displayFile(_event: any, file: any) {
    /***
    const _modal$: any = await this.fileInfoCtrl.openModalReturn(file);
    _modal$.onDidDismiss().then((data: any) => {
      const modalAction = ((data || {}).data || {}).action || '';
      // Setup modal return action to a real action
      if (modalAction === 'play') {
        this.playFile(_event, file);
      }
    });
    await _modal$.present();
    ***/
  }

  playFile(event: any, file: any) {
    this.PlayFile.emit(file);
  }

  scoreFile(event: any, file: any) {
    event.preventDefault();
    event.stopPropagation();
    this._router.navigate(['/v/player'], { queryParams: { bucket: file.bucket, key: file.Key, server: file.Server } });
  }

  changeBucket(event: any, mFolderList: any) {
    const folderInfo = mFolderList.find((m: any) => m.bucket === event);
    if (folderInfo && folderInfo.bucket) {
      // Load Bucket
      this.folderService.changeFolder$.next({
        server: this.folderService.shownServer,
        bucket: folderInfo.bucket,
      });
    }
  }

  changingFolder(data: any) {
    // console.log(data);
    const dataFiles = data.Contents || [];
    const dataFolders = data.CommonPrefixes || [];

    const curFiles = [];

    // List Folders
    const foLen = dataFolders.length;
    for (let fo = 0; fo < foLen; fo++) {
      const prefix = dataFolders[fo].Prefix || dataFolders[fo].Key || dataFolders[fo].key || dataFolders[fo].folder || '';
      if (prefix === data.Prefix) {
        continue;
      }
      curFiles.push({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Server: dataFolders[fo].Server || dataFolders[fo].server || this.folderService.shownServer,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Key: prefix,
        bucket: dataFolders[fo].Bucket || dataFolders[fo].bucket || dataFolders[fo].folder || this.folderService.shownBucket,
        name: prefix.substr(data.Prefix.length),
        cmd: (...args: any) => {
          (this.folderService.openFolder as any)(...args);
        },
        params: { queryParams: { folder: prefix } },
      });
    }

    // List Files
    const fLen = dataFiles.length;
    for (let f = 0; f < fLen; f++) {
      if (dataFiles[f].Key === data.Prefix) {
        continue;
      }
      dataFiles[f].name = dataFiles[f].Key.substr(data.Prefix.length);
      dataFiles[f].bucket = this.folderService.shownBucket;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      dataFiles[f].cmd = (...args: any) => {
        (this.folderService.openFolder as any)(...args);
      },
        dataFiles[f].params = { queryParams: { folder: dataFiles[f].Key } };
      curFiles.push(dataFiles[f]);
    }

    this.fileList.next(curFiles);
    if (!curFiles.length) {
      this.folderService.hasNoFiles = true;
    } else {
      this.folderService.hasNoFiles = false;
    }
    setTimeout(() => {
      this.folderService.isLoadingFiles = false;
    }, 100);
  }

}
