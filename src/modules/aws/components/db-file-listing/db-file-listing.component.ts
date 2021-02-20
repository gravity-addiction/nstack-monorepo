import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AwsCtrlService, FolderService } from '../../services';

@Component({
  selector: 'app-db-file-listing',
  templateUrl: './db-file-listing.component.html',
  styleUrls: ['./db-file-listing.component.scss'],
})
export class DbFileListingComponent implements OnInit, OnDestroy {
  @Input() folderService!: FolderService;

  public fileList: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);

  private _changeFolder$: Subscription;

  constructor(
    private _awsCtrl: AwsCtrlService,
    private _router: Router
  ) {

  }

  ngOnInit() {
    this._changeFolder$ = this.folderService.changeFolderObs.
    pipe(
      switchMap(v => this._awsCtrl.lsFolder(
            this.folderService.shownServer,
            this.folderService.shownBucket,
            this.folderService.shownFolder,
            this.folderService.shownLimit
        ).pipe(
          map((d: any) => {
            if ((!d.Contents || !(d.Contents || []).length) && (!d.CommonPrefixes || !(d.CommonPrefixes || []).length)) {
              this.folderService.hasNoFiles = true;
            }
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
    );
  }

  ngOnDestroy() {
    try {
      this._changeFolder$.unsubscribe();
    } catch (e) { }
  }

  displayFile(_event, file) {
    // this.fileInfoCtrl.openModal(file);
  }

  playFile(event, file) {
    event.preventDefault();
    event.stopPropagation();
    this._router.navigate(['/v/player'], { queryParams: { bucket: file.bucket, key: file.Key, server: file.Server }});
  }

  changingFolder(data) {
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
        cmd: (...args) => {
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
      dataFiles[f].cmd = (...args) => {
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
