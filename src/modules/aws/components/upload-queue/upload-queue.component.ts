import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

import { S3UploadService } from '../../services';

@Component({
  selector: 'app-aws-upload-queue',
  templateUrl: './upload-queue.component.html',
  styleUrls: ['./upload-queue.component.scss'],
})
export class UploadQueueComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    public s3UploadService: S3UploadService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  ngAfterViewInit() {
  }

  cancelUpload(q: any) {
    q.cancel$.next('Go!');
  }
}
