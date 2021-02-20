// eslint-disable-next-line max-len
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActionCtrlService } from '@modules/app-common/services/action-ctrl.service';
import { HelperService } from '@modules/app-common/services/helper-scripts.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { TokenService } from '@modules/auth/services/token.service';
import { instanceOfVideoPlayerInfoUrl } from '@classes/video-player';
import { Subscription } from 'rxjs';

import { VideoPlayerService, VideoService, VideoUrlService } from '../../services/index';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() videoPlayerService!: VideoPlayerService;
  @Input() videoSizeMultiplier!: number;
  @Output() videoLoaded: EventEmitter<any> = new EventEmitter<any>();
  @Output() videoError: EventEmitter<any> = new EventEmitter<any>();
  // eslint-disable-next-line @typescript-eslint/naming-convention
  @ViewChild('VideoDummyEle', { static: false }) VideoDummyEle!: ElementRef;

  @ViewChild('canvas', { static: false })
  set canvas(v: ElementRef) {
    if (!v || !v.nativeElement) {
      return;
    }
    this.videoPlayerService.canvasRef = v;
  }
  @ViewChild('VideoContainer', { static: false })
  set videoContainer(v: ElementRef) {
    if (!v || !v.nativeElement) {
      return;
    }
    this.videoPlayerService.videoContainerEle = v;
  }
  @ViewChild('video', { static: false })
  set video(v: ElementRef) {
    // console.log('Ref', v);
    if (!v || !v.nativeElement) {
      this.videoPlayerService.videoRef = null;
      return;
    }
    this.videoPlayerService.videoRef = v;

    if (this.videoPlayerService.videoEle) {
      // Mute All Videos?
      this.videoPlayerService.videoEle.muted = true;

      // Load Data Listener, Fire if already ready
      this.videoPlayerService.videoEle.addEventListener('loadeddata', this.onVideoLoaded);
      if (this.videoPlayerService.videoEle.readyState >= 3) {
        this.onVideoLoaded();
      }
    }
  }

  public errorOverflow = false;

  private subscriptions: Subscription = new Subscription();

  constructor(
    public actionCtrl: ActionCtrlService,
    public authService: AuthService,
    public tokenService: TokenService,
    public videoService: VideoService,
    public videoUrlService: VideoUrlService,

    private helperService: HelperService,
  ) { }

  @HostListener('drop', ['$event'])
  handleWindowDrop(event: any) {
    if (((event.dataTransfer || {}).files || []).length) {
      event.preventDefault();
      event.stopPropagation();
      const videoInfo = this.videoPlayerService.getLocalFileVideoInfo(event.dataTransfer.files[0]);
      if (videoInfo && instanceOfVideoPlayerInfoUrl(videoInfo) && this.videoPlayerService.changeVideo(videoInfo)) {
        this.videoPlayerService.showPlayer = true;
        this.videoPlayerService.showControls = true;
        this.videoPlayerService.videoEle?.play();
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  @HostListener('fullscreenchange', ['$event'])
  @HostListener('webkitfullscreenchange', ['$event'])
  @HostListener('mozfullscreenchange', ['$event'])
  @HostListener('MSFullscreenChange', ['$event'])
  @HostListener('window:resize', ['$event'])
  handleResizeEvent(event: any) {
    this.initWidth();
  }


  ngOnInit() {

  }

  ngOnDestroy() {
    // Clean Subscriptions
    this.subscriptions.unsubscribe();

    // Kill video player whenever leaving this video
    this.videoPlayerService.destroyPlayer();
  }

  ngAfterViewInit() {
    if (this.videoSizeMultiplier) {
      this.videoPlayerService.videoSizeMultiplier = this.videoSizeMultiplier;
    }
    this.initWidth();
  }

  onVideoError(e: any) {
    this.videoError.emit(e);
    if (this.errorOverflow) {
      //  console.log('To much error.');
      return;
    }

    this.errorOverflow = true;
    setTimeout(() => {
      this.errorOverflow = false;
    }, 5000);
  }

  initWidth() {
    const [mW, mH] = this.videoPlayerService.getPlayerSize(this.videoService.isFullscreen);
    if (!this.videoPlayerService.videoEle) {
      return;
    }

    this.videoPlayerService.videoEle.style.maxHeight = mH + 'px';
    this.videoPlayerService.videoEle.style.maxWidth = mW + 'px';

    try {
      this.VideoDummyEle.nativeElement.style.maxHeight = mH + 'px';
      this.VideoDummyEle.nativeElement.style.maxWidth = mW + 'px';
      this.VideoDummyEle.nativeElement.style.height = mH + 'px';
      this.VideoDummyEle.nativeElement.style.width = mW + 'px';
    } catch (e) { }

    const cW = (this.videoPlayerService.videoEle.clientWidth + 2) || mW;
    const cH = (this.videoPlayerService.videoEle.clientHeight + 2) || mH;

    this.videoPlayerService.canvasEle.style.maxHeight = cH + 'px';
    this.videoPlayerService.canvasEle.style.maxWidth = cW + 'px';

    this.videoPlayerService.canvasEle.style.width = cW + 'px';
    this.videoPlayerService.canvasEle.style.height = cH + 'px';
  }

  private onVideoLoaded = () => {
    this.videoLoaded.emit(true);
    setTimeout(() => {
      this.actionCtrl.triggerWindowResize();
    }, 50);
  };

}
