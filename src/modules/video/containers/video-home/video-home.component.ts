import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionCtrlService } from '@modules/app-common/services/action-ctrl.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { AwsCtrlService } from '@modules/aws/services/aws-ctrl.service';
import { HeaderComponent } from '@modules/navigation/containers/index';
import { UserService } from '@modules/users-shared/services/user.service';
import { Subscription } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

// import { VideoUploadCtrl } from '../../modals/index';
import { VideoFolderService, VideoService } from '../../services/index';

import { IFolder } from '@typings/aws-folders';
import { IUser } from '@typings/user';

@Component({
  selector: 'app-video',
  templateUrl: 'video-home.component.html',
  styleUrls: ['video-home.component.scss'],
})
export class VideoHomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('LocalFile', { static: true }) localFile: any;
  @ViewChild('appHeader', { static: true }) appHeader!: HeaderComponent;

  public subscriptions = new Subscription();
  public dragAndDropSupported = false;
  public isDragging = false;

  public userInfo!: IUser;
  public tmpFolderList: Array<IFolder> = [];

  private _lastUrl!: string;

  constructor(
    public actionCtrl: ActionCtrlService,
    private authService: AuthService,
    public awsCtrl: AwsCtrlService,
    private changeDetectorRef: ChangeDetectorRef,
    public userService: UserService,
    private _location: Location,
    private _router: Router,
    private _route: ActivatedRoute,
    public videoService: VideoService,
    // private videoUploadCtrl: VideoUploadCtrl,
    public videoFolderService: VideoFolderService
  ) {

    this._location.onUrlChange((url: string, state: unknown) => {
      // Track url changes for better folder updates
      if (url !== '/v' && url.indexOf('/v?') !== 0) {
        return;
      }
      if (this._lastUrl === url) {
        return;
      }

      this._lastUrl = url;
      const query: any = this.videoFolderService.folderService.getJsonFromUrl((url || ''));
      query._state = state;

      this.videoFolderService.openFolder(query);
    });


    // QUERY (First Only)
    this.subscriptions.add(
      this._route.queryParams.pipe(take(1)).pipe(
        tap((params: any) => {
          const url = this._router.url;
          if (url !== '/v' && url.indexOf('/v?') !== 0) {
            return;
          }
          if (this._lastUrl === url) {
            return;
          }

          this._lastUrl = url;
          const query: any = this.videoFolderService.folderService.getJsonFromUrl((url || ''));
          this.videoFolderService.folderService.updateVariables(query);
        }),
        switchMap(() => this.videoFolderService.initAwsFolders())
      ).subscribe()
    );

    this.subscriptions.add(
      this._route.fragment.pipe(map(fragment => fragment || 'None')).subscribe()
    );

  }

  @HostListener('window:drop', ['$event'])
  handleWindowDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.onChangeLocalVideo({ target: event.dataTransfer });
  }

  @HostListener('window:drag', ['$event'])
  @HostListener('window:dragstart', ['$event'])
  @HostListener('window:dragend', ['$event'])
  @HostListener('window:dragover', ['$event'])
  @HostListener('window:dragenter', ['$event'])
  @HostListener('window:dragleave', ['$event'])
  handleWindowDrag(event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (event.type !== 'dragleave' && !this.isDragging) {
      this.isDragging = true;
      setTimeout(() => {
        this.appHeader.mastHeading.nativeElement.style.backgroundColor = 'rgba(253, 88, 0, 0.8)';
      }, 50);
    } else if (event.type === 'dragleave' && event.x <= 0) {
      this.isDragging = false;
      setTimeout(() => {
        this.appHeader.mastHeading.nativeElement.style.backgroundColor = '';
      }, 50);
    }
  }



  ngOnInit() {
    // this.initAnonFolders();
    this.dragAndDropSupported = this.checkDropAbility();

    // User Folders
    this.subscriptions.add(
      this.authService.authRefreshed$.pipe(
        tap(() => {
          this.videoFolderService.newUserCleanup();
          this.videoFolderService.initAwsFolders();
          /*
                  const userInfo = this.authService.getAuthJson();
                  if (userInfo.username) {
                    this.videoFolderService.folderService.addFolders(null, {
                      id: 'home/' + userInfo.username + '/',
                      Server: 'us-west-2',
                      bucket: 'sdob-user-upload',
                      key: 'home/' + userInfo.username + '/',
                      title: 'My Folder',
                      expanded: true,
                      subs: new BehaviorSubject<Array<IFolder>>([
                        {
                          id: '',
                          title: 'New Folder',
                          style: { color: 'blue' },
                          expanded: null,
                          cmd: (...args) => { (<any>this.newFolder)(...args); }
                        }
                      ]),
                      cmd: (...args: any[]) => { (this.openFolder as any)(...args); },
                    }, 1);
                  }
          */
        })
      ).subscribe()
    );

    this.subscriptions.add(
      this.videoFolderService.folderService.changeFolderObs.pipe(
        tap((data: any) => {
          if (!data) {
            return;
          }
          this._location.go('v', this.videoFolderService.folderService.createLocationQuery());
        })
      ).subscribe()
    );

  }

  ngAfterViewInit() {
    this.localFile.nativeElement.addEventListener('change', this.onChangeLocalVideo);
    this.actionCtrl.navLoading = false;
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    try {
      this.localFile.nativeElement.removeEventListener('change', this.onChangeLocalVideo);
    } catch (e) { }
    this.videoFolderService.subscriptions.unsubscribe();
    this.subscriptions.unsubscribe();

    try {
      this.videoFolderService.folderService.clearFolders();
      this.videoFolderService.folderService.clearVariables();
      // this.folderService = null;
    } catch (e) { }
  }

  openFolder(event: any, folder: any, params: any) {
    this.videoFolderService.openFolder(folder);
  }

  checkDropAbility() {
    const div = document.createElement('div');
    return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
  }

  cloudUrlEnter(inp: any) {
    this._router.navigate(['/v/player'], { queryParams: { url: inp.value } });
  }

  googleIdEnter(inp: any) {
    this._router.navigate(['/v/player'], { queryParams: { url: 'https://drive.google.com/uc?export=download&id=' + inp.value } });
  }

  tryProtectedAuth(inp: any) {
    console.log(inp.value);
  }

  async uploadModal() {
    // const modal$ = await this.videoUploadCtrl.openModal();
  }

  private onChangeLocalVideo = (e: any) => {
    this.videoService.passLocalFile = e.target.files[0];
    this._router.navigateByUrl('/v/player');
  };

}
