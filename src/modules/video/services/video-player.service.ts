import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { IVideoPlayerInfoAws, IVideoPlayerInfoUrl } from '@typings/video';

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const Hls: any;

@Injectable()
export class VideoPlayerService implements OnDestroy {

  // videoRef getter / setter
  public videoEle: HTMLMediaElement | null = null;
  public get videoRef(): ElementRef | null {
    return this._videoRef || null;
  }
  public set videoRef(v: ElementRef | null) {
    this._videoRef = v;
    if (v) {
      this.videoEle = v.nativeElement;
    } else {
      this.videoEle = null;
    }
  }

  // canvasRef getter / setter
  public canvasEle!: HTMLCanvasElement;
  public canvasCtx!: CanvasRenderingContext2D | null;
  public get canvasRef(): ElementRef {
    return this._canvasRef;
  }
  public set canvasRef(v: ElementRef) {
    this._canvasRef = v;
    this.canvasEle = v.nativeElement;
    this.canvasCtx = this.canvasEle.getContext('2d', { alpha: true });
  }

  public videoContainerEle!: ElementRef;

  // Loading Status
  public videoLoading = false;
  public videoLoaded = false;
  public videoOpened = false;
  public videoHlsReady = false;

  // Loading Buffers
  public bufferedStart = 0;
  public bufferedStartPercent = 0;

  // AWS File Info
  public videoServer!: string;
  public videoBucket!: string;
  public videoKey!: string;
  public videoUrl!: string;
  public videoMime!: string;

  // Video Settings
  public videoFrameRate = 30; // 24;
  public videoTimeout = 0; // Timeout for
  public playbackRate = 100;
  public videoSelected = '#FFF';
  public videoTitle = '';
  public videoLastPause = 0;
  public videoBoxWidth = '100%';
  public videoSizeMultiplier = 1;

  // Hls Event Triggers
  public changedHlsEvent$: Subject<any> = new Subject<any>();

  // Cross Page Insights
  public showPlayer = false;
  public showControls = true;
  public videoLocal = false;
  public videoHls!: any;
  public videoHlsLevels: any[] = [];
  public videoHlsLevel = -1;
  public videoHlsWidth = -1;
  public videoHlsHeight = -1;

  private _bufferTimeout$: any;
  private _videoRef: ElementRef | null = null;
  private _canvasRef!: ElementRef;
  private _wfvInt: any;

  constructor() { }

  onVideoLoaded = () => {
    this.videoLoading = false;
    this.videoLoaded = true;

    if (this.videoEle) {
      this.videoEle.playbackRate = this.playbackRate / 100;
      try {
        this.videoEle.removeEventListener('loadeddata', this.onVideoLoaded);
      } catch (e) { }
    }
    try {
      clearInterval(this._bufferTimeout$);
    } catch (e) { }
    this._bufferTimeout$ = setInterval(this.checkLoadingBuffers, 500);

  };

  ngOnDestroy() {
    if (this.videoEle) {
      try {
        this.videoEle.removeEventListener('loadeddata', this.onVideoLoaded);
      } catch (e) { }
    }
    try {
      clearInterval(this._wfvInt);
    } catch (e) { }
    this.destroyPlayer();
  }

  destroyPlayer() {
    // console.log('Destroy Player');
    if (this.videoEle) {
      try {
        this.videoEle.pause();
      } catch (e) { }
      try {
        this.videoEle.removeAttribute('src');
      } catch (e) { } // empty source
      try {
        this.videoEle.load();
      } catch (e) { }
    }
  }

  saveSyncMark() {
    if (this.videoEle) {
      this.videoLastPause = this.videoEle.currentTime;
    }
  }

  checkLoadingBuffers = () => {
    if (this.videoEle && this.videoEle.buffered.length !== 0) {
      // this.bufferedStart = (this.videoEle.buffered.start(0) / this.videoEle.duration) * 100;
      // this.bufferedStartPercent = ((this.videoEle.buffered.end(0) - this.videoEle.buffered.start(0)) / this.videoEle.duration) * 100;
      this.bufferedStart = 0;
      this.bufferedStartPercent = (this.videoEle.buffered.end(0) / this.videoEle.duration) * 100;

      if (this.bufferedStartPercent >= 100) {
        clearInterval(this._bufferTimeout$);
      }
    }
  };

  getPlayerSize(isFullscreen = false) {
    const dW = document.body.clientWidth || window.innerWidth;
    const dH = window.innerHeight;

    // let mH = Math.floor(dH * ((isFullscreen) ? 1 : .8));
    // let mW = Math.floor(mH * (16 / 9));

    // if (dW < mW) {
    const mW = (dW * this.videoSizeMultiplier);
    const mH = (mW * (9 / 16));
    // }


    let sizeArr = [mW, mH];
    if (isFullscreen || mW < 482.2) {
      sizeArr = [mW, mH];
    } else if (mW > 1922.2 && dH > 1082.2) {
      sizeArr = [1920, 1080];
    } else if (mW > 1602.2 && dH > 902.2) {
      sizeArr = [1600, 900];
    } else if (mW > 1282.2 && dH > 722.2) {
      sizeArr = [1280, 720];
    } else if (mW > 957.8 && dH > 542.2) {
      sizeArr = [960, 540];
    } else if (mW > 722.2 && dH > 407.2) {
      sizeArr = [720, 405];
    } else if (mW > 642.2 && dH > 362.2) {
      sizeArr = [640, 360];
    } else {
      sizeArr = [480, 270];
    }

    if (isFullscreen && sizeArr[0] >= 482.2) {
      sizeArr[0] -= 50; sizeArr[1] = sizeArr[0] * (9 / 16);
    }
    return sizeArr;
  }


  cacheVideoInfo() {
    if (this.videoHls) {
      this.videoHlsLevels = this.videoHls.levels;
      // console.log('Levels',  this.videoHlsLevels);
      this.videoHlsLevel = this.videoHls.currentLevel;
      // console.log('Current Level', this.videoHlsLevel);
      this.videoHlsWidth = this.videoHlsLevels[this.videoHlsLevel].width;
      this.videoHlsHeight = this.videoHlsLevels[this.videoHlsLevel].height;
      return;
    }

    this.videoHlsLevels = [];
    this.videoHlsLevel = -1;
    this.videoHlsWidth = -1;
    this.videoHlsHeight = -1;
  }

  changeBitrate(newBitrateIndex: number) {
    this.videoHls.nextLevel = newBitrateIndex;
    this.cacheVideoInfo();
  }

  changeVideo(videoInfo: IVideoPlayerInfoUrl): boolean {
    if (!this.videoEle) {
      return false;
    }

    this.videoLoading = true;
    this.videoLoaded = false;

    if (this.videoHls) {
      this.videoHls.destroy();
      this.videoHls = null;
    }

    const isStreamed = videoInfo.url.split('.').pop();
    if (isStreamed === 'm3u8' && Hls.isSupported()) {
      this.videoHls = new Hls();
      this.videoHls.capLevelToPlayerSize = true;
      this.videoHls.loadSource(videoInfo.url);
      this.videoHls.attachMedia(this.videoEle);
      this.videoHls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.changedHlsEvent$.next({ event: Hls.Events.MANIFEST_PARSED });
        this.cacheVideoInfo();
      });
      this.videoHls.on(Hls.Events.LEVEL_LOADED, (data: any) => {
        this.changedHlsEvent$.next({ event: data });
      });

    } else if (isStreamed === 'm3u8') {
      console.log('Browser Does NoT Support HLS Streaming Video Sources');
    } else {
      this.videoEle.setAttribute('playsinline', '');
      this.videoEle.setAttribute('webkit-playsinline', '');
      this.videoEle.setAttribute('src', videoInfo.url);
    }

    // this.videoEle.src = videoInfo.url;
    this.videoFrameRate = videoInfo.fps || 59.94;
    this.videoTimeout = videoInfo.timeout || 0;

    try {
      this.videoEle.removeEventListener('loadeddata', this.onVideoLoaded);
    } catch (e) { }
    this.videoEle.addEventListener('loadeddata', this.onVideoLoaded);

    this.videoEle.load();
    return true;
  }


  // VIDEO COMMANDS PROXY
  videoToggle() {
    if (!this.videoLoaded) {
      return;
    }
    if (this.videoEle && this.videoEle.paused) {
      this.videoStart();
    } else {
      this.videoPause();
    }
  }

  videoStart() {
    if (!this.videoLoaded) {
      return;
    }
    if (this.videoEle) {
      this.videoEle.play();
    }

  }
  videoPause() {
    if (!this.videoLoaded) {
      return;
    }
    if (this.videoEle) {
      this.videoEle.pause();
    }
  }

  videoGoto(videoTime: number) {
    if (!this.videoLoaded) {
      return;
    }
    if (this.videoEle) {
      this.videoEle.currentTime = videoTime;
    }
  }

  videoFrameMove(amt: number) {
    if (!this.videoLoaded) {
      return;
    }
    if (this.videoEle) {
      this.videoEle.currentTime = this.videoEle.currentTime + ((1 / this.videoFrameRate) * amt);
    }
  }

  videoPlaybackRateMove(amt: number) {
    if (this.videoEle) {
      this.videoEle.playbackRate = this.videoEle.playbackRate + (amt / 100);
      this.playbackRate = Math.round(this.videoEle.playbackRate * 100);
    }
  }

  videoPlaybackRate(total: number) {
    if (this.videoEle) {
      this.videoEle.playbackRate = total;
      this.playbackRate = Math.round(this.videoEle.playbackRate * 100);
    }
  }

  videoRewind() {
    this.videoGoto(0);
  }

  videoForward() {
    if (this.videoEle) {
      this.videoGoto(this.videoEle.duration);
    }
  }

  waitForVideo() {
    this._wfvInt = setInterval(() => {
      if (this.videoEle && this.videoEle.readyState >= 3) {
        this.videoLoaded = true;
        clearInterval(this._wfvInt);
        this.videoEle.play();

        const w = this.videoEle.clientWidth;
        const h = this.videoEle.clientHeight;
        // this.canvasEle.nativeElement.style.width = w + 'px';
        // this.canvasEle.nativeElement.style.height = h + 'px';

      }
    }, 500);
  }


  // Player Video Opener
  gotoVideo(videoInfo: any): boolean {
    if (!this.videoEle) {
      return false;
    }
    this.videoOpened = true;
    const canPlay = this.videoEle.canPlayType(videoInfo.mime);

    if (
      (this.videoLocal && !canPlay) ||
      !this.changeVideo(videoInfo)
    ) {
      return false;
    }
    return true;
  }

  getLocalFileVideoInfo(passLocalFile: any): IVideoPlayerInfoAws | IVideoPlayerInfoUrl {
    return {
      url: URL.createObjectURL(passLocalFile),
      fps: 30,
      mime: passLocalFile.type || '*',
      timeout: 0,
    };
  }

  calcPercent(curTime: number, duration: number) {
    const progressPercent = (curTime / duration) * 100;
    return progressPercent;
  }
}
