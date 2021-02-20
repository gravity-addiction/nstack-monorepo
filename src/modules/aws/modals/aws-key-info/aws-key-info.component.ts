import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';

import { AwsCtrlService } from '../../services';

@Component({
  selector: 'app-aws-key-info',
  templateUrl: './aws-key-info.component.html',
  styleUrls: ['./aws-key-info.component.scss'],
})
export class AwsKeyInfoComponent implements OnInit, OnDestroy {
public awsInfo: any;
  public key: any;

  public awsSecret$!: Subscription;
  public isSecretLoading = true;

  constructor(
    private awsCtrlService: AwsCtrlService,
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit() {

    this.isSecretLoading = true;
    this.awsSecret$ = this.awsCtrlService.getAwsKeySecret(this.key.aws_key).
    subscribe((result: any) => {
      this.key = { ...this.key, ...result};
      this.isSecretLoading = false;
    }, (err: any) => {
      this.isSecretLoading = false;
      // console.log('Loading Error');
    }, () => this.isSecretLoading = false);
  }

  ngOnDestroy() {
    this.awsInfo = null;
    this.key = null;
    this.isSecretLoading = false;
    try {
 this.awsSecret$.unsubscribe();
} catch (e) { }
  }

  closeModal() {
    this.bsModalRef.hide();
  }
}
