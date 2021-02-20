import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { VideoMediainfoService, VideoPlayerService, VideoService } from '../../services/index';

@Component({
  selector: 'app-video-ffprobe',
  templateUrl: './video-ffprobe.component.html',
  styleUrls: ['./video-ffprobe.component.scss'],
})
export class VideoFfprobeComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() set videoPlayer(v: VideoPlayerService) {
    this.videoPlayerService = v;

    // Add Loaded Event
    if (this.videoPlayerService.videoEle) {
      this.videoPlayerService.videoEle.addEventListener('loadeddata', this.onVideoLoaded);
    }
    // if (this.videoPlayerService.videoEle.readyState >= 3) { this.initWidth(); }
  }
  @Input() fileInput!: any;
  @ViewChild('VideoFfprobe', { static: true }) videoStats!: ElementRef;

  public videoPlayerService!: VideoPlayerService;

  public mediaInfoResult: any;
  public mediaInfoProcessing = '';
  public mediaInfoLoading = 0;
  public mediaInfoFormats: any;

  private _mediainfo$!: Subscription;
  private _localFile: any;


  constructor(
    private videoMediainfoService: VideoMediainfoService,
    public videoService: VideoService
  ) { }


  ngOnInit() { }

  ngOnDestroy() {
    try {
      this._mediainfo$.unsubscribe();
    } catch (e) { }
  }

  ngAfterViewInit() {
    if (this.fileInput) {
      this.fileInput.getInputElement().then((inp: any) => {
        inp.addEventListener('change', this.onChangeLocalVideo);
      });
    }
  }

  cleanAll() {
    this.mediaInfoResult = null;
    this.mediaInfoProcessing = '';
  }

  mediainfo(file: any) {
    if (!file) {
      return;
    }
    try {
      this._mediainfo$.unsubscribe();
    } catch (e) { }
    this._mediainfo$ = this.videoMediainfoService.mediainfo(file).
      subscribe(loading => {
        this.mediaInfoLoading = loading;
        if (loading === 200) {
          this.mediaInfoFormats = this.videoMediainfoService.getFormat() || {};
        }
      }, err => {
        this.mediaInfoProcessing = '';
      });
  }

  private onChangeLocalVideo = (e: any) => {
    this._localFile = e.target.files[0];
    this.mediainfo(this._localFile);
  };

  private onVideoLoaded = () => {
    this.cleanAll();
  };
}
