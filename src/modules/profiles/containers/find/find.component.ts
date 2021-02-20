import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActionCtrlService } from '@modules/app-common/services/index';
import { ProfileService } from '@modules/profiles/services/index';

@Component({
  selector: 'app-find',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './find.component.html',
  styleUrls: ['find.component.scss'],
})
export class FindComponent implements OnInit, AfterViewInit {
  constructor(
    public actionCtrl: ActionCtrlService,
    public profileService: ProfileService
  ) { }

  ngOnInit() { }
  ngAfterViewInit() {
    this.actionCtrl.navLoading = false;
  }
}
