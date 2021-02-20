import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '@modules/auth/services/auth.service';
import { TokenService } from '@modules/auth/services/token.service';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

// eslint-disable-next-line max-len
import { VideoControlsButtonsEndClippingComponent, VideoControlsButtonsItem, VideoControlsButtonsStartComponent, VideoControlsTimelineComponent, VideoControlsTimelineItem } from '../../components';
import { VideoPlayerService, VideoQueueService, VideoUrlService } from '../../services';

import { IVideoPlayerInfoAws, IVideoPlayerInfoUrl, IVideoQueue } from '@typings/video';

@Component({
  selector: 'app-video-queue',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './video-queue.component.html',
  styleUrls: ['video-queue.component.scss'],
})
export class VideoQueueComponent implements OnInit {
  public subscriptions: Subscription = new Subscription();

  videoQueueListArr: IVideoQueue[] = [];

  public videoPlayer: any;
  public videoTimelineItem!: VideoControlsTimelineItem;
  public videoControlsStartItem!: VideoControlsButtonsItem;
  public videoControlsEndItem!: VideoControlsButtonsItem;

  public videoPlayerVQ: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private changeDetectorRef: ChangeDetectorRef,
    private tokenService: TokenService,
    private videoQueueService: VideoQueueService,
    private videoUrlService: VideoUrlService
  ) { }
  ngOnInit() {
    this.fetchVideoQueueList();

    const newEntry: any = {
      player: new VideoPlayerService(),
    };
    newEntry.timeline = new VideoControlsTimelineItem(VideoControlsTimelineComponent, newEntry.player, {});
    newEntry.startbtns = new VideoControlsButtonsItem(VideoControlsButtonsStartComponent, newEntry.player, {});
    newEntry.endbtns = new VideoControlsButtonsItem(VideoControlsButtonsEndClippingComponent, newEntry.player, { vq: this.videoPlayerVQ });
    this.videoPlayer = newEntry;

    this.videoPlayer.showPlayer = true;
    this.changeDetectorRef.detectChanges();
  }

  fetchVideoQueueList() {
    // qVideo.loadScores = true;

    this.subscriptions.add(
      this.videoQueueService.getVideoQueueList().pipe(
        tap((data: any) => {
          this.videoQueueListArr = data;
          this.changeDetectorRef.detectChanges();
        }),
        catchError((_err: any) => {
          // qVideo.loadScores = false;
          throw _err;
        })
      ).subscribe()
    );
  }


  playFile(event: any) {
    if (event.hasOwnProperty('Key') && event.hasOwnProperty('bucket')) {
      // console.log('Play File', event);
      this.videoLoadAws((event.server || 'us-west-2'), event.bucket, event.Key).
        then((videoInfo: IVideoPlayerInfoAws | IVideoPlayerInfoUrl) => {
          if (this.videoPlayer.player.changeVideo(videoInfo)) {
            this.videoPlayerVQ.next(event);
            this.videoPlayer.player.showPlayer = true;
            this.videoPlayer.player.showControls = true;
            // this.videoPlayers[0].player.videoEle.play();
          }
        });
    } else {
      console.log('Cannot Play File', event);
    }
  }

  videoLoadAws(videoServer: string, videoBucket: string, videoKey: string): Promise<IVideoPlayerInfoAws | IVideoPlayerInfoUrl> {
    // const bucketInfo = this.awsCtrl.getBucket(this.videoBucket);

    // Use Cookie Tokens
    if (
      this.tokenService.cookiesEnabled &&
      this.cookieService.get('cookieSupport') &&
      videoBucket === 'sdob-videos'
    ) {
      return this.videoUrlService.getVideoCookie(videoKey, videoBucket, videoServer).pipe(
        map((): IVideoPlayerInfoAws | IVideoPlayerInfoUrl => {
          const keyUrl = 'https://sdob-1.cloudfront.skydiveorbust.com/' + videoKey;
          return { url: keyUrl, fps: 30, timeout: 0, mime: '*' };
        })
      ).toPromise();

      // Use URL Token
    } else {
      const videoTimeout = new Date().getTime() + 30000;
      return this.videoUrlService.getVideoUrl(videoKey, videoBucket, videoServer).pipe(
        map((url: string): IVideoPlayerInfoAws | IVideoPlayerInfoUrl => ({ url, fps: 30, mime: '*', timeout: videoTimeout }))
      ).toPromise();

    }
  }
}
