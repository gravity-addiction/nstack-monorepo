
import { Injectable } from '@angular/core';
import { AuthService } from '@modules/auth/services/auth.service';
import { AwsCtrlService } from '@modules/aws/services/aws-ctrl.service';
import { FolderService } from '@modules/aws/services/folder.service';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { IFolder } from '@typings/aws-folders';

@Injectable({
  providedIn: 'root',
})
export class VideoFolderService {
  folderService: FolderService;
  subscriptions: Subscription;

  constructor(
    private awsCtrl: AwsCtrlService,
    private authService: AuthService
  ) {
    this.folderService = new FolderService();
    this.subscriptions = new Subscription();
  }

  newUserCleanup() {
    this.folderService.clearFolders();
  }

  newFolder(event: any, folder: any) {
    prompt('New Folder?');
  }

  openFolder(folder: any) {
    this.folderService.changeFolder$.next(folder);
  }

  initAnonFolders() {
    // Static Folders
    this.folderService.addFolders(null, [{
      id: 'public',
      title: 'All Public Videos',
      anonymous: true,
      expanded: false,
      cmd: (...args: any[]) => {
        (this.openFolder as any)(...args);
      },
    }, {
      id: 'recent',
      title: 'Recent Videos',
      anonymous: true,
      expanded: false,
      cmd: (...args: any[]) => {
        (this.openFolder as any)(...args);
      },
    }]);
  }

  initAwsFolders(): Observable<any> {
    // this.initAnonFolders();

    // const hasAuthToken = this.authService.hasAuthToken();
    // if (hasAuthToken) {
    // S3 Buckets
    return this.awsCtrl.lsBuckets().pipe(
      tap((buckets: any) => {
        const bList = (buckets || {}).Buckets || [];
        const bLen = bList.length;
        const newFolders = [];
        for (let b = 0; b < bLen; b++) {
          const newBucket = {
            id: '',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Server: 'us-west-2',
            title: bList[b].Name,
            bucket: bList[b].Name,
            expanded: false,
            cloudfront: (bList[b].Name === 'sdob-videos'),
            subs: new BehaviorSubject<Array<IFolder>>([]),
            cmd: (...args: any[]) => {
              (this.openFolder as any)(...args);
            },
          };
          newFolders.push(newBucket);
        }

        this.folderService.addFolders(null, newFolders, 2);
      })
    );
    // }

    // return of({});
  }


}
