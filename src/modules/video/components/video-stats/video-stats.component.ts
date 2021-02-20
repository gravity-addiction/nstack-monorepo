import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';

import { VideoPlayerService, VideoService } from '../../services/index';

@Component({
  selector: 'app-video-stats',
  templateUrl: './video-stats.component.html',
  styleUrls: ['./video-stats.component.scss'],
})
export class VideoStatsComponent implements OnInit {

  @Input() set videoPlayer(v: VideoPlayerService) {
    this.videoPlayerService = v;

    // Add Loaded Event
    if (this.videoPlayerService.videoEle) {
      this.videoPlayerService.videoEle.addEventListener('loadeddata', this.onVideoLoaded);
      if (this.videoPlayerService.videoEle.readyState >= 3) {
        this.initWidth();
      }
    }
  }
  @ViewChild('VideoStats', { static: true }) videoStats!: ElementRef;

  public videoPlayerService!: VideoPlayerService;

  constructor(
    public videoService: VideoService
  ) { }

  @HostListener('window:resize', ['$event'])
  handleResizeEvent(event: any) {
    this.initWidth();
  }

  ngOnInit() { }

  initWidth() {
    const [mW, mH] = this.videoPlayerService.getPlayerSize(this.videoService.isFullscreen);
    try {
      this.videoStats.nativeElement.style.maxWidth = mW + 'px';
    } catch (e) { }
  }

  cleanAll() {

  }

  private onVideoLoaded = () => {
    this.cleanAll();
    this.initWidth();
  };
}
