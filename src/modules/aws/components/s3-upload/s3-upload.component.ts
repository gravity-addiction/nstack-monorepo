// eslint-disable-next-line max-len
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Sha256Service } from '@modules/app-common/services/sha256.service';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AwsS3UploadStatus, S3UploadService } from '../../services/s3-upload.service';

@Component({
  selector: 'app-aws-s3-upload',
  templateUrl: './s3-upload.component.html',
  styleUrls: ['./s3-upload.component.scss'],
})
export class S3UploadComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() eventId!: string;
  @Input() shortId!: string;
  @Input() discipline!: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  @ViewChild('FileInput', { static: false }) FileInput!: ElementRef;
  @Output() fileStatus: EventEmitter<any> = new EventEmitter<any>();

  public canUpload = false;
  public acceptFile = true;
  public isUploading = false;
  public currentUpload!: any;
  public progressSent = 0;
  public processingBtn = '';
  public progressLoaded = 0;
  public progressTotal = 0;

  private _localFile: any;
  private subscriptions: Subscription = new Subscription();
  private subscriptionsUpload: Subscription = new Subscription();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public s3UploadService: S3UploadService,
    private sha256: Sha256Service
  ) { }


  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.subscriptionsUpload.unsubscribe();
    this.destroyListeners();
  }

  ngAfterViewInit() {
    this.setListeners();
  }

  setListeners() {
    if (this.FileInput && this.FileInput.nativeElement) {
      this.FileInput.nativeElement.addEventListener('change', this.onChangeLocalVideo);
    }
  }

  destroyListeners() {
    if (this.FileInput && this.FileInput.nativeElement) {
      this.FileInput.nativeElement.removeEventListener('change', this.onChangeLocalVideo);
    }
  }

  cancelUpload() {
    this.currentUpload.cancel$.next('Go!');
    this.subscriptionsUpload.unsubscribe();
  }

  cleanAll() {
    this.canUpload = false;
    this.isUploading = false;
  }




  async uploadFile() {
    const f = this._localFile || '';
    if (!f) {
      return;
    }
    const fName = f.name;
    const fType = f.type;
    this.isUploading = true;
    this.acceptFile = false;
    const fileData = await this.sha256.getHash(f);
    // console.log('File Data', fileData);

    this.subscriptionsUpload.add(
      this.s3UploadService.uploadStatus.pipe(
        tap((data: any) => {
          // In Progress
          if (data.hasOwnProperty('progress')) {
            this.progressSent = (parseInt(data.progress, 10) || 0) * 100 || 0;
            this.progressLoaded = data.loaded || 0;
            this.progressTotal = data.total || 0;
          }

          // Finishing Up
          if (data.status === AwsS3UploadStatus.IDLE && data.progress >= 1) {
            this.isUploading = false;

            // Finished
          } else if (data.status === AwsS3UploadStatus.FINISHED && this.isUploading) {
            this.isUploading = false;
            this.acceptFile = true;
            setTimeout(() => {
              this.ngAfterViewInit();
            }, 250);
          } else if (data.status === AwsS3UploadStatus.ERROR) {
            // console.log('Upload Error!', data.err);
            this.isUploading = false;
            this.acceptFile = true;
            setTimeout(() => {
              this.ngAfterViewInit();
            }, 250);
          }
        }),
        tap(() => {
          this.changeDetectorRef.detectChanges();
        })
      ).subscribe()
    );

    this.subscriptionsUpload.add(
      this.s3UploadService.getPostUrl(fName, fType, fileData).pipe(
        // Send file to aws server
        map((url: string) => this.s3UploadService.addFileToQueue(url, fType, f)),

        // Attach upload latest queueEntry to currentUpload
        tap((queueEntry: any) => {
          this.currentUpload = queueEntry;
        })
      ).subscribe()
    );
  }


  private onChangeLocalVideo = (e: any) => {
    this._localFile = e.target.files[0];
    this.fileStatus.emit({ status: 'changed', f: e.target.files });
    this.canUpload = true;
  };
}
