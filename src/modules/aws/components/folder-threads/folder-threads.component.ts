import { Component, Input, OnInit } from '@angular/core';

import { AwsCtrlService } from '../../services/aws-ctrl.service';
import { FolderService } from '../../services/folder.service';

@Component({
  selector: 'app-aws-folder-threads',
  templateUrl: './folder-threads.component.html',
  styleUrls: ['./folder-threads.component.scss'],
})
export class FolderThreadsComponent implements OnInit {
  @Input() folderService!: FolderService;
  @Input() folderParent: any = {};
  @Input() folderList: Array<any> = [];

  constructor(
    private awsCtrl: AwsCtrlService
  ) { }

  ngOnInit() {

  }

  folderClick(event: any, folder: any, parent: any) {
    if (folder.expanded !== null) {
      folder.expanded = !folder.expanded;
      if (!folder.subs.getValue().length && folder.expanded) {
        // console.log(folder.bucket, folder.key);
        // Fetch List
        // this.awsCtrl.lsFolder(folder.bucket, folder.key);
      }
    }
    this.folderService.execFolder(event, folder);
  }

  folderArrowClick(event: any, folder: any) {
    event.preventDefault();
    event.stopPropagation();
    folder.expanded = !folder.expanded;
  }

}
