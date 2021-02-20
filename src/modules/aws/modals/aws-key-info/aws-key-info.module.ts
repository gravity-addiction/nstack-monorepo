import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Injectable, NgModule, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { combineLatest, Subscription } from 'rxjs';

import { AwsKeyInfoComponent } from './aws-key-info.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    AwsKeyInfoComponent,
  ],
  entryComponents: [
    AwsKeyInfoComponent,
  ],
})
export class AwsKeyInfoModule { }


@Injectable({
  providedIn: 'root',
})
export class AwsKeyInfoCtrl implements OnDestroy {
  modalRef!: BsModalRef;
  subscription: Subscription = new Subscription();
  constructor(
    private modalCtrl: BsModalService,
    private changeDetection: ChangeDetectorRef
  ) { }

  async openModal(key: any, awsInfo: any) {
    const initialState = {
      awsInfo,
      key,
    };

    const _combine = combineLatest([
      this.modalCtrl.onShow,
      this.modalCtrl.onHide,
    ]).subscribe(() => this.changeDetection.markForCheck());

    this.subscription.add(
      this.modalCtrl.onHide.subscribe((reason: string) => {
        this.modalRef.content.ngOnDestroy();
      })
    );

    this.subscription.add(_combine);

    this.modalRef = this.modalCtrl.show(AwsKeyInfoComponent, { initialState });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
